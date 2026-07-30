"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/feed");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">
        <span className="gradient-text">SocialConnect</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-400">
        Share what&apos;s on your mind. Discover posts you&apos;ll love with
        AI-powered recommendations.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/auth/signup"
          className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Get Started
        </Link>
        <Link
          href="/auth/login"
          className="rounded-full border border-white/20 px-8 py-3 font-semibold transition-colors hover:bg-white/5"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
