import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
