import { createClerkClient, verifyToken } from '@clerk/backend';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const payload = await verifyToken(token, {secretKey: process.env.CLERK_SECRET_KEY});
    const userId = payload.sub;
    if (!userId) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    await clerkClient.users.deleteUser(userId);
    return Response.json({ message: 'User deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
