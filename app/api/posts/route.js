import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/jwtHelper';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();
    // console.log(total);
    const totalPages = Math.ceil(total / limit);
    // console.log(totalPages);

    return new Response(
      JSON.stringify({ posts, page, totalPages }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}


export async function POST(req) {
  try {
    await dbConnect();
    const { title, content } = await req.json();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ message: 'Authorization header missing or malformed' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    const newPost = await Post.create({
      title,
      content,
      author: user.id, // Assuming `id` is part of the decoded token
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}