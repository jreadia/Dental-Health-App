import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/mock-ml/predict
// Simulates the YOLOv8n FastAPI server response
router.post('/api/mock-ml/predict', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No image provided to ML model' });
  }

  // Simulate a successful ML prediction
  // In reality, the ML model would return a NEW image with boxes drawn.
  // For the mock, we'll just return the exact same image encoded as base64.
  const base64Image = req.file.buffer.toString('base64');

  return res.json({
    status: 'success',
    annotated_image_base64: base64Image,
    metadata: {
      boxes: [
        { x: 100, y: 150, width: 45, height: 60, label: 'calculus', confidence: 0.88 },
        { x: 200, y: 100, width: 30, height: 30, label: 'calculus', confidence: 0.75 }
      ],
      overall_diagnosis: 'Calculus detected, scaling recommended'
    }
  });
});

export default router;
