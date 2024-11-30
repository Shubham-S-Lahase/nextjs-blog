import { verifyToken } from '@/lib/jwtHelper';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    // console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ message: 'Authorization header missing or malformed' }),
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    // console.log('Decoded Token:', verifyToken(token));
    // console.log('Decoded ID:', decoded.id);
    // console.log('Decoded Role:', decoded.role);

    if (!decoded) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 401,
      });
    }

    await dbConnect();

    const userId = new ObjectId(decoded.id);

    const user = await User.findById(userId).select(
      'username email profilePicture role'
    );

    // console.log('Queried User:', user);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
