import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    // Get the data from the request body
    const { username, email, password, fileUrl, role } = await req.json();

    // Check if all required fields are present
    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({
          message: "Username, email, and password are required",
        }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user, including the fileUrl (profile picture URL)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: fileUrl,
      role: role || "user",
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: {
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }
}
