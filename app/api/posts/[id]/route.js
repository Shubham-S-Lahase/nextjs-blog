import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { verifyToken } from '@/lib/jwtHelper';

export async function GET(req, { params }) {
  try {
    // Await the params object to access its properties
    const { id } = await params; 

    if (!id) {
      return new Response(JSON.stringify({ message: 'Post ID is required' }), { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Authorization header missing or malformed' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    const post = await Post.findById(id)
    .populate('author', 'username') 
    .populate({
      path: 'comments',
      select: 'content author createdAt',
      populate: {
        path: 'author', 
        select: 'username', 
      },
    });

    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ post }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Authorization header missing or malformed' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();
    const post = await Post.findById(id);

    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    // Check if the user is the author (admins cannot edit posts)
    if (post.author.toString() !== user.id) {
      return new Response(JSON.stringify({ message: 'Forbidden: Only the author can edit this post' }), { status: 403 });
    }

    const updates = await req.json();
    Object.assign(post, updates);
    await post.save();

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Authorization header missing or malformed' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();
    const post = await Post.findById(id);

    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    // Check if the user is the author or has admin privileges
    if (post.author.toString() !== user.id && user.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Forbidden: Only the author or an admin can delete this post' }), { status: 403 });
    }

    await Comment.deleteMany({ postId: id });
    
    await Post.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: 'Post deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
