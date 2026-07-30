import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const user = await User.findById(id)
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar")
      .lean();
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json(user);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await import("next-auth")).getServerSession;
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/authOptions");
    const sessionResult = await getServerSession(authOptions);
    if (!sessionResult?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (sessionResult.user as { id: string }).id;
    if (userId !== id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, avatar } = await request.json();
    await connectToDatabase();

    const updated = await User.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(bio !== undefined && { bio }), ...(avatar && { avatar }) },
      { new: true }
    ).select("-password");

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
