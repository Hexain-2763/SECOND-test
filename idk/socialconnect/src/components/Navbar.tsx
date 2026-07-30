"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();

  const userId = (session?.user as { id?: string })?.id;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
        >
          SocialConnect
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {session ? (
            <>
              <Link
                href="/feed"
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Feed
              </Link>
              <Link
                href={`/profile/${userId}`}
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
