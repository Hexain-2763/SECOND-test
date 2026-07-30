"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TAGS = ["travel", "tech", "food", "fitness", "art", "music", "gaming", "nature"];

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tags: selectedTags }),
      });

      if (res.ok) {
        setContent("");
        setSelectedTags([]);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/50 p-4 backdrop-blur-sm dark:bg-white/5"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedTags.includes(tag)
                ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white"
                : "border border-white/10 bg-white/5 text-gray-400 hover:border-violet-500/50 hover:text-violet-400"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
