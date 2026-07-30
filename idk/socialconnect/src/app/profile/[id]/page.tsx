"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import PostCard from "@/components/PostCard";

interface UserProfile {
  _id: string;
  name: string;
  bio: string;
  avatar: string;
  followers: { _id: string; name: string }[];
  following: { _id: string; name: string }[];
  createdAt: string;
}

interface Post {
  _id: string;
  author: { _id: string; name: string; avatar: string };
  content: string;
  likes: string[];
  tags: string[];
  createdAt: string;
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [followState, setFollowState] = useState({ followers: 0, isFollowing: false });

  const currentUserId = (session?.user as { id?: string })?.id;
  const isOwner = currentUserId === id;

  useEffect(() => {
    Promise.all([
      fetch(`/api/users/${id}`).then((r) => r.json()),
      fetch("/api/posts").then((r) => r.json()),
    ])
      .then(([userData, postsData]) => {
        setUser(userData);
        setName(userData.name);
        setBio(userData.bio || "");
        setFollowState({
          followers: userData.followers?.length || 0,
          isFollowing:
            userData.followers?.some(
              (f: { _id: string }) => f._id === currentUserId
            ) || false,
        });
        setPosts(
          postsData.filter((p: Post) => p.author._id === id)
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, currentUserId]);

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/users/${id}/follow`, { method: "POST" });
      const data = await res.json();
      setFollowState({
        followers: data.followers,
        isFollowing: data.following,
      });
    } catch {}
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser((prev) => (prev ? { ...prev, ...updated } : null));
        setEditing(false);
      }
    } catch {}
  };

  const handleDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-gray-500">User not found</div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400 text-2xl font-bold text-white">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a bio..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(user.name);
                      setBio(user.bio);
                    }}
                    className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-gray-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="mt-1 text-sm text-gray-400">
                  {user.bio || "No bio yet"}
                </p>
                <div className="mt-3 flex gap-4 text-sm text-gray-400">
                  <span>
                    <strong className="text-white">{followState.followers}</strong>{" "}
                    followers
                  </span>
                  <span>
                    <strong className="text-white">{user.following?.length || 0}</strong>{" "}
                    following
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {!isOwner && session && (
          <button
            onClick={handleFollow}
            className={`mt-4 rounded-full px-6 py-2 text-sm font-medium transition-all ${
              followState.isFollowing
                ? "border border-white/20 text-gray-300 hover:bg-white/5"
                : "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:opacity-90"
            }`}
          >
            {followState.isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

        {isOwner && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="mt-4 rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold gradient-text">Posts</h2>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="py-10 text-center text-gray-500">No posts yet</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
