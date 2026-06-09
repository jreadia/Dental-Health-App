import express from 'express';
import upload from '../middleware/upload.js';
import verifyFirebaseToken from '../middleware/token.js';
import cloudinary from '../config/cloudinary.js';
import { createDentalImage, getUserImages } from '../services/dentalImageService.js';
import { dentalImageCreateSchema } from '../schemas/dentalImageSchema.js';
import axios from 'axios';
import FormData from 'form-data';

const router = express.Router();

// POST /api/v1/dental-images - Upload image (Requires Authentication)
router.post('/api/v1/dental-images', verifyFirebaseToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get userId from the decoded Firebase token
    const userId = req.user.uid;

    // --- ML GATEKEEPER START ---
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname || 'image.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
    });

    // TODO: Change this URL to your teammate's Render URL when ready.
    const port = process.env.PORT || 3000;
    const mlApiUrl = `http://localhost:${port}/api/mock-ml/predict`;

    let mlResponse;
    try {
      mlResponse = await axios.post(mlApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        }
      });
    } catch (mlErr) {
      console.error('Error connecting to ML API:', mlErr);
      return res.status(503).json({ error: 'ML Service is currently unavailable' });
    }

    // Extract YOLOv8n data from the ML response (assuming it always succeeds if the service is up)
    const { annotated_image_base64, metadata } = mlResponse.data;
    const annotatedImageBuffer = Buffer.from(annotated_image_base64, 'base64');
    // --- ML GATEKEEPER END ---

    // Helper to upload buffer to Cloudinary
    const uploadBufferToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'dental_images' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    };

    try {
      // Upload BOTH images to Cloudinary in parallel to save time
      const [originalUpload, annotatedUpload] = await Promise.all([
        uploadBufferToCloudinary(req.file.buffer),
        uploadBufferToCloudinary(annotatedImageBuffer)
      ]);

      const originalImageUrl = originalUpload.secure_url;
      const annotatedImageUrl = annotatedUpload.secure_url;
      // Generate a unique image ID from the original upload
      const imageId = originalUpload.public_id.split('/').pop() || Date.now().toString();

      // Prepare data for Firestore
      const rawImageData = {
        userId,
        originalImageUrl,
        annotatedImageUrl,
        mlResults: metadata,
      };

      // Validate data using Zod before saving
      const validated = dentalImageCreateSchema.safeParse(rawImageData);
      if (!validated.success) {
        console.error('Validation failed:', validated.error);
        return res.status(500).json({ error: 'Data validation failed after upload' });
      }

      // Add the upload date
      const imageData = {
        ...validated.data,
        uploadDate: new Date().toISOString(),
      };

      // Save to Firestore using existing service
      const dbResult = await createDentalImage(imageId, imageData);

      return res.status(201).json({
        success: true,
        message: 'Image uploaded and processed successfully',
        data: {
          imageId: dbResult.imageId,
          originalImageUrl,
          annotatedImageUrl,
          mlResults: metadata
        },
      });
    } catch (uploadOrDbError) {
      console.error('Cloudinary or Firestore error:', uploadOrDbError);
      return res.status(500).json({ error: 'Failed to process image and save data' });
    }

  } catch (error) {
    console.error('Upload route error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred during upload' });
  }
});

// GET /api/v1/dental-images - Get user's image history
router.get('/api/v1/dental-images', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const images = await getUserImages(userId);
    return res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error('Fetch history error:', error);
    return res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

export default router;
