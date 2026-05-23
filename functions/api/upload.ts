/// <reference types="@cloudflare/workers-types" />

export const onRequestPost: PagesFunction<{ IMAGEKIT_PRIVATE_KEY: string }> = async (context) => {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const folder = formData.get('folder') as string || '/shopverse_applications';

    // Prefer environment variable, fallback to hardcoded if not set
    const privateKey = env.IMAGEKIT_PRIVATE_KEY || 'private_XcrPV5epyI0QefKFJjAyza0ivSw=';
    
    // Debug log for key presence (DO NOT LOG FULL KEY)
    console.log(`[Upload Function] Private Key loaded: ${privateKey ? privateKey.substring(0, 8) + '...' : 'MISSING'}`);

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: 'No file provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[Upload Function] Processing:', { name: file.name, type: file.type, size: file.size });

    // Generate a truly unique filename with random string and timestamp
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const cleanFileName = (fileName || file.name || 'upload').replace(/[^a-zA-Z0-9.-]/g, '_');
    const finalFileName = `${timestamp}_${uniqueId}_${cleanFileName}`;

    // Create a new FormData for ImageKit
    const ikFormData = new FormData();
    ikFormData.append('file', file);
    ikFormData.append('fileName', finalFileName);
    ikFormData.append('folder', folder);
    ikFormData.append('useUniqueFileName', 'true');

    const authHeader = 'Basic ' + btoa(privateKey + ':');

    console.log('[Upload Function] Forwarding to ImageKit...');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // DO NOT set Content-Type header, let fetch set it with boundary
      },
      body: ikFormData,
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('[Upload Function] Non-JSON response:', responseText);
      return new Response(JSON.stringify({ success: false, error: 'Invalid response from ImageKit', details: responseText }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!response.ok) {
      console.error('[Upload Function] ImageKit API Error:', response.status, result);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'ImageKit Error', 
        message: result.message || 'Upload failed',
        details: result 
      }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[Upload Function] Success:', result.url);
    return new Response(JSON.stringify({ success: true, url: result.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Upload Function] Internal Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
