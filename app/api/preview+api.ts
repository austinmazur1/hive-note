import { createSupabaseClientWithToken } from '@/lib/supabase-server';
import { getLinkPreview } from 'link-preview-js';

// If url, then we getLinkPreview
// If an image, then we save to supabase storage and get the public url
// Then we save to supabase database
// Return success to client

export async function POST(request: Request) {
  let preview: any;
  const authHeader = request.headers.get('Authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!request.body) {
    return Response.json({ error: 'No body' }, { status: 400 });
  }

  const body = await request.json();
  const supabaseServer = createSupabaseClientWithToken(token);
  const isScreenshot = body.type === 'screenshot';

  console.log('supabaseServer', supabaseServer);
  console.log('body', body);

  if (!isScreenshot) {
    preview = await getLinkPreview(body.content);
  }

  const { data, error } = await supabaseServer
    .from('items')
    .insert({
      ...body,
      content: preview,
      image: isScreenshot ? body.content : preview.images[0],
    })
    .select()
    .single();
  if (error) {
    console.error('error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ success: true });
}
