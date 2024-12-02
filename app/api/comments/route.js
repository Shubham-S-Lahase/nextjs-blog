import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/jwtHelper";

export async function POST(req) {
  try {
    const { content, postId } = await req.json();
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await dbConnect();

    const comment = await Comment.create({
      content,
      postId,
      author: user.id,
    });

    const populatedComment = await Comment.findById(comment._id).populate("author", "username _id");

    await Post.findByIdAndUpdate(postId, { $push: { comments: populatedComment._id } });

    return new Response(JSON.stringify(populatedComment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}