import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
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

    if (userId === id) {
      return Response.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    await connectToDatabase();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isFollowing = targetUser.followers.includes(userId as unknown as never);

    if (isFollowing) {
      targetUser.followers.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { following: id } });
    } else {
      targetUser.followers.addToSet(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { following: id } });
    }

    await targetUser.save();

    return Response.json({
      followers: targetUser.followers.length,
      following: !isFollowing,
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
