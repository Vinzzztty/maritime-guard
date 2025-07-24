"use client";
import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <h1>Dashboard</h1>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    )
}