import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwtHelper';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // Generate JWT
    // console.log('Signing token with payload:', { id: user._id.toString(), role: user.role });
    const token = signToken({ id: user._id.toString(), role: user.role });

    
    // console.log('Generated Token:', token);
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: { id: user._id },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
