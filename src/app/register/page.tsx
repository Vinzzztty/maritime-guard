"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      setSuccess("Registration successful! You can now log in.");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
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
          <h2 className="text-2xl font-bold text-blue-800 text-center">Create an Account</h2>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm">{success}</div>}
          
          <input
            type="text"
            placeholder="Username"
            className="border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
          />
          
          <input
            type="email"
            placeholder="Email"
            className="border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          
          <button
            type="submit"
            className="bg-blue-700 text-white font-semibold py-2 rounded hover:bg-blue-800 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/login" className="text-blue-700 font-semibold hover:underline">Sign In</a>
        </div>
      </div>
      <Footer />
    </div>
  );
} 