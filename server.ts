import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import FormData from 'form-data';

dotenv.config();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Request logging
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  // Basic CORS support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Handle upload proxy for AI Studio
  const uploadHandler = async (req: any, res: any) => {
    try {
      const file = req.file;
      const fileName = req.body.fileName;
      const folder = req.body.folder || '/shopverse_applications';

      // Strictly hardcoded as requested by user to avoid configuration issues
      const privateKey = 'private_XcrPV5epyI0QefKFJjAyza0ivSw=';

      if (!file) {
        console.warn('[Proxy] Upload attempt with no file');
        console.log('[Proxy] Request body:', req.body);
        return res.json({ success: false, error: 'No file provided' });
      }

      console.log('[Proxy] File received:', file.originalname, file.mimetype, file.size, 'bytes');

      const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
      
      const cleanFileName = (fileName || file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
      const form = new FormData();
      
      // Use the raw buffer directly - this is the most robust way
      form.append('file', file.buffer, {
        filename: cleanFileName,
        contentType: file.mimetype
      });
      
      form.append('fileName', cleanFileName);
      form.append('folder', folder);
      form.append('useUniqueFileName', 'true');

      console.log(`[Proxy] Forwarding file to ImageKit: ${file.originalname} (${file.size} bytes)`);

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          ...form.getHeaders(),
        },
        body: form as any,
      });

      const responseBody = await response.text();
      let result;
      try {
        result = JSON.parse(responseBody);
      } catch (e) {
        console.error('[Proxy] Error parsing non-JSON ImageKit response:', responseBody);
        return res.json({ 
          success: false, 
          error: 'Invalid response from ImageKit', 
          details: responseBody 
        });
      }

      if (!response.ok) {
        console.error('[Proxy] ImageKit API returned error:', response.status, result);
        const ikMessage = result.message || (result.error && result.error.message) || 'Unknown ImageKit error';
        return res.json({ 
          success: false, 
          error: 'ImageKit Error', 
          message: ikMessage,
          details: result,
          status: response.status 
        });
      }

      console.log('[Proxy] Successfully uploaded to ImageKit:', result.url);
      res.json({ success: true, url: result.url });
    } catch (error) {
      console.error('[Proxy] Critical Error:', error);
      res.json({ 
        success: false, 
        error: 'Internal proxy error', 
        message: error instanceof Error ? error.message : String(error) 
      });
    }
  };

  app.post('/api/process-upload', upload.single('file'), uploadHandler);
  app.post('/api/upload', upload.single('file'), uploadHandler);
  app.post('/api/app-upload', upload.single('file'), uploadHandler);

  // Health check for configuration
  app.get('/api/config-check', (req, res) => {
    res.json({
      imageKitKeySet: !!process.env.IMAGEKIT_PRIVATE_KEY,
      nodeEnv: process.env.NODE_ENV
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
