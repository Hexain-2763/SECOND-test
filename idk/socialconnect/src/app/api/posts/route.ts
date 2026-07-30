import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .limit(50)
      .lean();
    return Response.json(posts);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, image, tags } = await request.json();
    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    await connectToDatabase();

    const userId = (session.user as { id: string }).id;
    const post = await Post.create({
      author: userId,
      content: content.trim(),
      image: image || "",
      tags: tags || [],
    });

    const populated = await post.populate("author", "name avatar");
    return Response.json(populated, { status: 201 });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
