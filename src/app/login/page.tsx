"use client";
import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: searchParams.get("callbackUrl") || "/dashboard",
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (res?.ok) {
        // Redirect to dashboard or the original callback URL
        const redirectUrl = res.url || "/dashboard";
        router.push(redirectUrl);
        router.refresh(); // Force a refresh to update the session
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6 border-t-4 border-blue-400"
        >
          <h2 className="text-2xl font-bold text-blue-800 text-center">Sign In</h2>
          <p className="text-gray-600 text-center text-sm">
            Access your shipping fleet dashboard
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <a 
            href="/register" 
            className="text-blue-700 font-semibold hover:underline hover:text-blue-800 transition-colors"
          >
            Create Account
          </a>
        </div>
        
        <div className="mt-4 text-center">
          <a 
            href="/" 
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
} 