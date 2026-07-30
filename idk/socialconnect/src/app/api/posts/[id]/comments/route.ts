import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const comments = await Comment.find({ post: id })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .lean();
    return Response.json(comments);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
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

    if (!content?.trim()) {
      return Response.json({ error: "Comment content required" }, { status: 400 });
    }

    await connectToDatabase();
    const userId = (session.user as { id: string }).id;

    const comment = await Comment.create({
      post: id,
      author: userId,
      content: content.trim(),
    });

    const populated = await comment.populate("author", "name avatar");
    return Response.json(populated, { status: 201 });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
