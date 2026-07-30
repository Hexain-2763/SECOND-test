"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import Recommendations from "@/components/Recommendations";

interface Post {
  _id: string;
  author: { _id: string; name: string; avatar: string };
  content: string;
  likes: string[];
  tags: string[];
  createdAt: string;
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const userId = (session?.user as { id?: string })?.id;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <CreatePost />
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg">No posts yet</p>
              <p className="text-sm">Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={userId}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      <aside className="hidden md:block">
        <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <h2 className="mb-4 text-sm font-bold gradient-text">
            ✨ For You
          </h2>
          <Recommendations />
        </div>
      </aside>
    </div>
  );
}
