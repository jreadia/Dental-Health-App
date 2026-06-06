import express from 'express';
import upload from '../middleware/upload.js';
import verifyFirebaseToken from '../middleware/token.js';
import cloudinary from '../config/cloudinary.js';
import { createDentalImage } from '../services/dentalImageService.js';
import { dentalImageCreateSchema } from '../schemas/dentalImageSchema.js';

const router = express.Router();

// POST /api/dental-images/upload - Upload an image and save to Firestore
router.post('/api/dental-images/upload', verifyFirebaseToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get userId from the decoded Firebase token
    const userId = req.user.uid;

    // Stream the image buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'dental_images' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
        }

        try {
          // Cloudinary gives us a secure URL
          const imageUrl = result.secure_url;

          // Generate a unique image ID (or use Cloudinary's public_id)
          const imageId = result.public_id.split('/').pop() || Date.now().toString();

          // Prepare data for Firestore
          const rawImageData = {
            userId,
            imageUrl,
          };

          // Validate data using Zod before saving
          const validated = dentalImageCreateSchema.safeParse(rawImageData);
          if (!validated.success) {
            console.error('Validation failed:', validated.error);
            return res.status(500).json({ error: 'Data validation failed after upload' });
          }

          // Add the upload date (which isn't in the schema, it's handled server-side)
          const imageData = {
            ...validated.data,
            uploadDate: new Date().toISOString(),
          };

          // Save to Firestore using existing service
          const dbResult = await createDentalImage(imageId, imageData);

          return res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
              imageId: dbResult.imageId,
              imageUrl,
            },
          });
        } catch (dbError) {
          console.error('Firestore save error:', dbError);
          return res.status(500).json({ error: 'Failed to save image data to database' });
        }
      }
    );

    // End the stream with the buffer
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload route error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred during upload' });
  }
});

export default router;
