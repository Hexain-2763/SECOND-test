import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id)
      .populate("author", "name avatar bio")
      .lean();
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json(post);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();
    await connectToDatabase();

    const userId = (session.user as { id: string }).id;
    const post = await Post.findOneAndUpdate(
      { _id: id, author: userId },
      { content },
      { new: true }
    ).populate("author", "name avatar");

    if (!post) {
      return Response.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }
    return Response.json(post);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const userId = (session.user as { id: string }).id;
    const post = await Post.findOneAndDelete({ _id: id, author: userId });

    if (!post) {
      return Response.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }
    return Response.json({ message: "Post deleted" });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
