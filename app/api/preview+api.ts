import { getLinkPreview } from "link-preview-js";


export async function GET(request: Request) {
    const preview = await getLinkPreview("https://www.youtube.com/watch?v=MejbOFk7H6c");
    console.debug(preview);
    return Response.json({ preview });
}
