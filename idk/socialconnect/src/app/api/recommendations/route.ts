import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    await connectToDatabase();

    const user = await User.findById(userId).lean();
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).lean();
    const interactedTags = [...new Set(likedPosts.flatMap((p) => p.tags))];

    let recommendedPosts;
    if (interactedTags.length > 0) {
      recommendedPosts = await Post.find({
        tags: { $in: interactedTags },
        _id: { $nin: user.likedPosts },
        author: { $ne: userId },
      })
        .sort({ createdAt: -1 })
        .populate("author", "name avatar")
        .limit(10)
        .lean();
    } else {
      recommendedPosts = await Post.find({ author: { $ne: userId } })
        .sort({ likes: -1, createdAt: -1 })
        .populate("author", "name avatar")
        .limit(10)
        .lean();
    }

    const followingIds = user.following.map((id: { toString(): string }) => id.toString());
    const recommendedUsers = await User.find({
      _id: { $ne: userId, $nin: followingIds },
    })
      .select("name avatar bio")
      .limit(5)
      .lean();

    return Response.json({ posts: recommendedPosts, users: recommendedUsers });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
