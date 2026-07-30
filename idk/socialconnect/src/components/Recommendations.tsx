"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RecommendedUser {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
}

interface RecommendedPost {
  _id: string;
  author: { _id: string; name: string; avatar: string };
  content: string;
  likes: string[];
}

export default function Recommendations() {
  const [users, setUsers] = useState<RecommendedUser[]>([]);
  const [posts, setRecommendedPosts] = useState<RecommendedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setRecommendedPosts(data.posts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {users.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-400">Suggested Profiles</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <Link
                key={user._id}
                href={`/profile/${user._id}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-xs font-bold text-white">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {user.bio || "No bio yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-400">Trending Posts</h3>
          <div className="space-y-2">
            {posts.slice(0, 3).map((post) => (
              <div
                key={post._id}
                className="rounded-xl p-3 transition-colors hover:bg-white/5"
              >
                <p className="text-xs text-gray-400">by {post.author.name}</p>
                <p className="mt-1 text-sm line-clamp-2">{post.content}</p>
                <p className="mt-1 text-xs text-pink-400">❤️ {post.likes.length}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
