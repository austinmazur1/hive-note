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

  const { type, content, tags, collectionIds, newCollectionName } = body as {
    type: string;
    content: string;
    tags?: string[];
    collectionIds?: string[] | null;
    newCollectionName?: string | null;
  };

  if (!isScreenshot) {
    preview = await getLinkPreview(content);
  }

  const itemPayload = {
    type,
    content: isScreenshot ? content : preview,
    image: isScreenshot ? content : preview?.images?.[0] ?? null,
    tags: tags ?? [],
  };

  const { data, error } = await supabaseServer
    .from('items')
    .insert(itemPayload)
    .select('id')
    .single();
  if (error) {
    console.error('error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const itemId = data.id as string;
  const collectionIdsToLink: string[] = [];

  if (Array.isArray(collectionIds) && collectionIds.length > 0) {
    collectionIdsToLink.push(...collectionIds);
  }
  if (typeof newCollectionName === 'string' && newCollectionName.trim()) {
    const { data: newCollection, error: createErr } = await supabaseServer
      .from('collections')
      .insert({ name: newCollectionName.trim() })
      .select('id')
      .single();
    if (createErr) {
      console.error('create collection error', createErr);
      return Response.json({ error: createErr.message }, { status: 500 });
    }
    collectionIdsToLink.push(newCollection.id as string);
  }

  for (const collectionIdToLink of collectionIdsToLink) {
    const { error: linkErr } = await supabaseServer
      .from('collection_items')
      .insert({ collection_id: collectionIdToLink, item_id: itemId });
    if (linkErr) {
      console.error('collection_items insert error', linkErr);
      return Response.json({ error: linkErr.message }, { status: 500 });
    }
  }

  return Response.json({ success: true, itemId });
}
