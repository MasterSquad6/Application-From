
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle API Uploads
    if (url.pathname === "/api/upload" && request.method === "POST") {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const fileName = formData.get('fileName');
        const folder = formData.get('folder') || '/shopverse_applications';

        if (!file) {
          return new Response(JSON.stringify({ success: false, error: 'No file provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // ImageKit Private Key (Priority: Env > Hardcoded Fallback)
        const privateKey = env.IMAGEKIT_PRIVATE_KEY || 'private_XcrPV5epyI0QefKFJjAyza0ivSw=';

        // Generate unique filename
        const uniqueId = Math.random().toString(36).substring(2, 8);
        const timestamp = Date.now();
        const cleanName = (fileName || file.name || 'upload').replace(/[^a-zA-Z0-9.-]/g, '_');
        const finalFileName = `${timestamp}_${uniqueId}_${cleanName}`;

        const ikFormData = new FormData();
        ikFormData.append('file', file);
        ikFormData.append('fileName', finalFileName);
        ikFormData.append('folder', folder);
        ikFormData.append('useUniqueFileName', 'true');

        const authHeader = 'Basic ' + btoa(privateKey + ':');

        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': authHeader
          },
          body: ikFormData
        });

        const result = await response.json();

        if (!response.ok) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'ImageKit Error', 
            details: result 
          }), { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true, url: result.url }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Default: Forward to static assets (handled by Cloudflare Pages)
    return env.ASSETS.fetch(request);
  }
};
