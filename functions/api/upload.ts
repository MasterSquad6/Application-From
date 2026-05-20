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

    if (!file) {
      console.error('[Upload Function] No file provided');
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
    }

    console.log('[Upload Function] File details:', { name: (file as any).name, type: file.type, size: file.size });

    const cleanFileName = (fileName || (file as any).name || 'unknown_file').replace(/[^a-zA-Z0-9.-]/g, '_');

    // ImageKit Upload API expects a specific multipart/form-data structure
    const ikFormData = new FormData();
    ikFormData.append('file', file);
    ikFormData.append('fileName', cleanFileName);
    ikFormData.append('folder', folder);
    ikFormData.append('useUniqueFileName', 'true');

    const authHeader = 'Basic ' + btoa(privateKey + ':');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: ikFormData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Upload Function] ImageKit API Error:', result);
      return new Response(JSON.stringify({ error: 'Upload failed', details: result }), { status: response.status });
    }

    return new Response(JSON.stringify({ url: (result as any).url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Upload Function] Internal Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
