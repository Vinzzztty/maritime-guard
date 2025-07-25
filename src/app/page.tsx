"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FAQS = [
  {
    question: "How accurate are the sensors?",
    answer:
      "Our sensors are engineered for marine environments and provide highly accurate, continuous corrosion data.",
  },
  {
    question: "Is installation disruptive?",
    answer:
      "We offer flexible installation options, including wet installation, to minimize downtime for your vessels.",
  },
  {
    question: "What is the pricing model?",
    answer:
      "Our platform is available via a subscription model, with options for both hardware and software packages.",
  },
  {
    question: "Does this help with compliance?",
    answer:
      "Yes, our reporting tools are designed to support compliance with major maritime regulations and standards.",
  },
];

const carouselImages = [
  { src: "dashboard.webp", alt: "Dashboard Preview 1" },
  { src: "dashboard2.webp", alt: "Dashboard Preview 2" },
  { src: "dashboard3.webp", alt: "Dashboard Preview 3" },
];

const carouselDotColors = [
  "bg-green-400",
  "bg-yellow-400",
  "bg-red-400"
];

function DashboardCarousel({ current, setCurrent }: { current: number; setCurrent: (idx: number) => void }) {
  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current === carouselImages.length - 1 ? 0 : current + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-72 sm:h-96 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-xl flex items-center justify-center overflow-hidden">
      <img
        src={carouselImages[current].src}
        alt={carouselImages[current].alt}
        className="object-contain h-full w-full transition-all duration-300"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
      {/* Dots (if you want them inside the carousel, you can move this here) */}
    </div>
  );
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const handleDotClick = (idx: number) => setCurrent(idx);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="font-sans min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <div className="h-16 md:h-[68px]" /> {/* Spacer for navbar */}

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center py-28 px-4 text-center bg-gradient-to-br from-blue-700 via-blue-400 to-blue-100 overflow-hidden shadow-lg min-h-[70vh]">
          {/* Decorative Circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-300 opacity-30 rounded-full blur-2xl z-0 animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-white drop-shadow-lg leading-tight">
              Detect Corrosion.<br className="hidden sm:block" /> Protect Your Ship Hulls.
            </h1>
            <p className="text-xl sm:text-2xl mb-4 max-w-2xl mx-auto text-blue-50 font-medium drop-shadow">
            The MaritimeGuard Dashboard offers an advanced, real-time interface for comprehensive corrosion monitoring across vessel hulls.
            </p>
            <p className="mb-8 text-lg text-blue-100 max-w-xl">
              <span className="font-semibold text-yellow-200">Engineered for performance, compliance, and operational clarity,</span> the platform integrates intelligent sensor data with actionable insights empowering ship managers and engineers to make informed maintenance decisions with confidence.

            </p>
            
            {/* Conditional Button Display */}
            {status === "loading" ? (
              <div className="flex gap-4 mb-8">
                <div className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg animate-pulse">
                  Loading...
                </div>
              </div>
            ) : session ? (
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={handleGoToDashboard}
                  className="inline-block bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
                >
                  Go to Dashboard
                </button>
                <span className="inline-block bg-blue-100 text-blue-800 px-6 py-4 rounded-full font-medium text-lg">
                  Welcome, {session.user?.username || session.user?.email}!
                </span>
              </div>
            ) : (
              <div className="flex gap-4 mb-8">
                <a href="/login" className="inline-block bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-300 transition-all duration-200 transform hover:scale-105">Login</a>
                <a href="/register" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">Register</a>
              </div>
            )}

            {/* Dashboard Mockup Placeholder */}
            <div className="w-full flex justify-center">
              <div className="bg-white/80 rounded-2xl shadow-2xl border border-blue-100 p-6 w-full max-w-2xl flex flex-col items-center animate-fade-in">
                <DashboardCarousel current={current} setCurrent={setCurrent} />
                <div className="flex gap-4 mt-4">
                  {carouselDotColors.map((color, idx) => (
                    <span
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 border-blue-200 cursor-pointer transition-all duration-200 ${color} ${idx === current ? "ring-2 ring-blue-500 scale-110" : ""}`}
                      onClick={() => handleDotClick(idx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-10 bg-gradient-to-r from-blue-100 via-white to-blue-100 w-full" />

        {/* Problem & Solution */}
        <section className="py-16 px-4 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">Corrosion Threatens Ship Hull Integrity and Safety</h2>
          <p className="mb-4 text-lg text-gray-700">Corrosion Threatens Ship Hull Structural Strength and Safety</p>
          <p className="font-semibold text-blue-700">Our web app delivers continuous, sensor driven monitoring providing early warnings and actionable insights to keep your Ship seaworthy and efficient.
          </p>
        </section>

        {/* Features & Benefits */}
        <section id="features" className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
          <h2 className="text-3xl font-bold text-center mb-14 text-blue-800">Why Use Our Corrosion Detection Platform?</h2>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-200 group border-t-4 border-blue-400 hover:scale-105 animate-fade-in-up">
              <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">🛠️</span>
              <h3 className="font-semibold mb-2 text-blue-700 text-lg">Sensor-Based Monitoring</h3>
              <p className="text-gray-600 text-center">Deploy advanced sensors on ship hulls for accurate, real-time corrosion detection and data collection.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-200 group border-t-4 border-blue-400 hover:scale-105 animate-fade-in-up delay-100">
              <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">📈</span>
              <h3 className="font-semibold mb-2 text-blue-700 text-lg">Live Dashboard</h3>
              <p className="text-gray-600 text-center">Visualize hull condition instantly with intuitive RAG (Red/Amber/Green) status indicators and detailed analytics.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-200 group border-t-4 border-blue-400 hover:scale-105 animate-fade-in-up delay-200">
              <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">⚡</span>
              <h3 className="font-semibold mb-2 text-blue-700 text-lg">Early Warning Alerts</h3>
              <p className="text-gray-600 text-center">Receive immediate notifications when corrosion risk is detected, enabling proactive maintenance and repairs.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-200 group border-t-4 border-blue-400 hover:scale-105 animate-fade-in-up delay-300">
              <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">📄</span>
              <h3 className="font-semibold mb-2 text-blue-700 text-lg">Compliance & Reporting</h3>
              <p className="text-gray-600 text-center">Generate reports for regulatory compliance and share data with engineers or authorities as needed.</p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-10 bg-gradient-to-r from-blue-100 via-white to-blue-100 w-full" />

        {/* How It Works */}
        <section id="how" className="py-20 px-4 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14 text-blue-800">How It Works</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="flex-1 flex flex-col items-center md:items-start">
              <ol className="space-y-8 text-left max-w-xl relative border-l-4 border-blue-200 pl-8">
                <li className="relative animate-fade-in-up">
                  <span className="absolute -left-8 top-0 w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">1</span>
                  <span className="font-bold text-blue-700">Install corrosion sensors</span> on the ship hull at critical points.
                </li>
                <li className="relative animate-fade-in-up delay-100">
                  <span className="absolute -left-8 top-0 w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">2</span>
                  <span className="font-bold text-blue-700">Sensors transmit real-time data</span> to the web application.
                </li>
                <li className="relative animate-fade-in-up delay-200">
                  <span className="absolute -left-8 top-0 w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">3</span>
                  <span className="font-bold text-blue-700">Monitor hull condition</span> via the live dashboard and receive instant alerts.
                </li>
                <li className="relative animate-fade-in-up delay-300">
                  <span className="absolute -left-8 top-0 w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">4</span>
                  <span className="font-bold text-blue-700">Download compliance-ready reports</span> and share insights with your team.
                </li>
              </ol>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/80 rounded-2xl shadow-2xl border border-blue-100 p-6 flex flex-col items-center animate-fade-in">
                <div className="w-full h-40 sm:h-56 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 text-xl font-semibold">[ Live Data Visualization ]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial / Social Proof */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-100 via-white to-blue-50">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-block bg-white rounded-xl shadow-lg px-10 py-8 animate-fade-in">
              <div className="flex flex-col items-center gap-3 mb-4">
                <span className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl text-blue-700 shadow">👨‍✈️</span>
                <span className="font-semibold text-blue-700">Ship Operations Manager</span>
              </div>
              <p className="italic text-lg text-blue-800">"With real-time hull monitoring, we've reduced maintenance costs and improved fleet safety."</p>
            </div>
          </div>
        </section>

                {/* Education Get Know Section */}
                <section id="education-blog" className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Get Know More</h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                href: "/education/page1",
                title: "Why Corrosion Matters in Maritime Industry",
                description: "Understand the impact of corrosion on ships and why early detection is crucial for safety and cost savings.",
              },
              {
                href: "/education/page2",
                title: "Steel Corrosion on Ship Hulls",
                description: "Explore each card to understand the causes, types, impacts, and prevention of steel corrosion on ship hulls.",
              },
              {
                href: "/education/page3",
                title: "Ship Hull Corrosion Monitoring Technologies",
                description: "Explore the latest technologies for monitoring and preventing corrosion on ship hulls",
              },
            ].map((post) => (
              <div key={post.href} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start hover:shadow-2xl transition-all duration-200 group border-t-4 border-blue-400 hover:scale-105 animate-fade-in-up">
                <h3 className="font-semibold mb-2 text-blue-700 text-lg">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <a
                  href={post.href}
                  className="mt-auto inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-base shadow-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
              <div key={faq.question} className="bg-blue-50 rounded-xl p-6 shadow-sm transition-all">
                <button
                  className="w-full flex justify-between items-center text-left font-semibold text-blue-700 text-lg focus:outline-none"
                  onClick={() => {}}
                  aria-expanded={false}
                  aria-controls={`faq-content-${idx}`}
                >
                  {faq.question}
                  <span className="ml-2 transition-transform rotate-0">▼</span>
                </button>
                <div
                  id={`faq-content-${idx}`}
                  className="overflow-hidden transition-all duration-300 max-h-0 opacity-0"
                  aria-hidden={true}
                >
                  <p className="text-gray-700 text-base">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-blue-50">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Contact Us</h2>
          <p className="text-center text-blue-900 mb-4">Have questions or want a demo? Reach out to us!</p>
          <div className="flex flex-col items-center gap-2">
            <a href="mailto:info@maritimeguard.com" className="text-blue-700 font-semibold hover:underline">info@maritimeguard.com</a>
            <span className="text-blue-700">+62 812-3456-7890</span>
          </div>
        </section>

        <Footer />
    </div>
  );
}
