import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;
    await connectToDatabase();

    const post = await Post.findById(id);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const alreadyLiked = post.likes.includes(userId as unknown as never);

    if (alreadyLiked) {
      post.likes.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: id } });
    } else {
      post.likes.addToSet(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { likedPosts: id } });
    }

    await post.save();

    return Response.json({
      likes: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
