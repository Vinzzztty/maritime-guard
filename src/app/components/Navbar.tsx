"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status } = useSession();
  const isAuth = status === "authenticated";

  if (status === "loading") {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/70 shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <span className="text-blue-800 font-bold text-lg">Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/70 shadow-sm border-b border-blue-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-blue-800 tracking-tight">
          <Image src="/logo.webp" alt="Logo" width={32} height={32} />
          MaritimeGuard
        </Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex gap-8 items-center font-medium text-blue-900">
          <Link href="/#features" className="hover:text-blue-700 transition">Features</Link>
          <Link href="/#how" className="hover:text-blue-700 transition">How It Works</Link>
          <Link href="/#faq" className="hover:text-blue-700 transition">FAQ</Link>
          <Link href="/#contact" className="hover:text-blue-700 transition">Contact</Link>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuth ? (
            <>
              <Link
                href="/dashboard"
                className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-green-600 transition-all text-base"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition-all text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-semibold shadow hover:bg-yellow-300 transition-all text-base"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition-all text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 