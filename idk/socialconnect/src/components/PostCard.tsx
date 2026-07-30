"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Post {
  _id: string;
  author: { _id: string; name: string; avatar: string };
  content: string;
  likes: string[];
  tags: string[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

export default function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(
    currentUserId ? post.likes.includes(currentUserId) : false
  );
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<
    { _id: string; author: { name: string }; content: string }[]
  >([]);
  const [commentText, setCommentText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUserId === post.author._id;
  const timeAgo = getTimeAgo(post.createdAt);

  const handleLike = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, { method: "POST" });
      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch {}
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`);
      const data = await res.json();
      setComments(data);
      setCommentCount(data.length);
      setShowComments(true);
    } catch {}
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentCount((prev) => prev + 1);
        setCommentText("");
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete?.(post._id);
      }
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/50 p-5 backdrop-blur-sm transition-all hover:border-violet-500/30 dark:bg-white/5">
      <div className="flex items-start justify-between">
        <Link href={`/profile/${post.author._id}`} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-sm font-bold text-white">
            {post.author.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{post.author.name}</p>
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
        </Link>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-400 hover:text-red-300"
          >
            {deleting ? "..." : "Delete"}
          </button>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
          }`}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </button>
        <button
          onClick={loadComments}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-400 transition-colors"
        >
          💬 {commentCount}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 border-t border-white/5 pt-3">
          {session && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-full border border-white/10 bg-transparent px-4 py-1.5 text-xs placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          )}
          {comments.map((c) => (
            <div key={c._id} className="flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-[10px] font-bold text-white">
                {c.author.name[0].toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-semibold">{c.author.name}</span>
                <p className="text-xs text-gray-300">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
