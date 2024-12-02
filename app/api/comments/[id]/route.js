import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { verifyToken } from "@/lib/jwtHelper";

export async function PATCH(req, { params }) {
    try {
      const { id } = await params;
      const { content } = await req.json();
      const token = req.headers.get("Authorization")?.split(" ")[1];
      const user = verifyToken(token);
  
      if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
      }
  
      await dbConnect();
  
      const comment = await Comment.findById(id);
      if (!comment) {
        return new Response(JSON.stringify({ message: "Comment not found" }), { status: 404 });
      }
  
      if (comment.author.toString() !== user.id) {
        return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
      }
  
      comment.content = content;
      await comment.save();
  
      return new Response(JSON.stringify(comment), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  }
  
  // Delete Comment
  export async function DELETE(req, { params }) {
    try {
      const { id } = await params;
      const token = req.headers.get("Authorization")?.split(" ")[1];
      const user = verifyToken(token);
  
      if (!user) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
      }
  
      await dbConnect();
  
      const comment = await Comment.findById(id);
      if (!comment) {
        return new Response(JSON.stringify({ message: "Comment not found" }), { status: 404 });
      }
  
      if (comment.author.toString() !== user.id && user.role !== "admin") {
        return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
      }
  
      await Comment.findByIdAndDelete(id);
  
      return new Response(JSON.stringify({ message: "Comment deleted successfully" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  }
  