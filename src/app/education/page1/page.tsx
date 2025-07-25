"use client"
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState } from 'react';

const corrosionCards = [
  {
    icon: "👋",
    question: "Welcome to Why Corrosion Matters in Maritime Industry",
    answer: (
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">Curious about why corrosion is a big deal for ships?</p>
        <p className="text-lg">Explore each card to learn the risks, costs, and importance of early detection. Use the <span className="font-bold">Next</span> button to begin!</p>
      </div>
    ),
  },
  {
    icon: "❓",
    question: "What is corrosion?",
    answer: (
      <div>
        <p>Corrosion is a natural process where metals like steel react with their environment—especially water and oxygen—causing them to deteriorate and form rust. On ships, this weakens the hull and other structures over time.</p>
      </div>
    ),
  },
  {
    icon: "🚢",
    question: "Why does corrosion matter in the maritime industry?",
    answer: (
      <div>
        <p>Corrosion is a major threat to the structural integrity and safety of ships. It can lead to:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Hull weakening and leaks</li>
          <li>Increased risk of accidents or sinking</li>
          <li>Costly repairs and downtime</li>
          <li>Regulatory compliance issues</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "💸",
    question: "What are the costs of corrosion?",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2">
          <li>Expensive steel replacement and repairs</li>
          <li>Frequent dry-docking and maintenance</li>
          <li>Lost revenue due to downtime</li>
          <li>Potential environmental fines for leaks</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "⏰",
    question: "Why is early detection important?",
    answer: (
      <div>
        <p>Early detection helps prevent costly repairs, reduces downtime, and ensures compliance with maritime regulations. It allows ship owners to take action before corrosion becomes a major problem.</p>
      </div>
    ),
  },
  {
    icon: "🛡️",
    question: "How can corrosion be prevented or managed?",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2">
          <li>Applying protective coatings and paints</li>
          <li>Using cathodic protection (sacrificial anodes)</li>
          <li>Regular inspections and maintenance</li>
          <li>Installing real-time corrosion monitoring sensors</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "📊",
    question: "How does MaritimeGuard help?",
    answer: (
      <div>
        <p>Our platform enables ship owners to monitor hull condition in real time, making maintenance proactive rather than reactive. It provides:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Continuous sensor data</li>
          <li>Early warnings and alerts</li>
          <li>Automated compliance-ready reports</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "💡",
    question: "Final Thoughts",
    answer: (
      <div className="text-center">
        <blockquote className="italic text-blue-900 text-lg mb-2">
          "Proactive corrosion management keeps your fleet safe, efficient, and compliant."
        </blockquote>
        <p className="text-blue-700 font-semibold">Thank you for learning why corrosion matters in the maritime industry!</p>
      </div>
    ),
  },
];

export default function EducationPage1() {
  const [step, setStep] = useState(0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 flex flex-col flex-grow justify-center items-center py-20 px-4">
        <div className="max-w-2xl w-full bg-blue-50 rounded-2xl shadow-xl p-8 md:p-12 space-y-8 flex flex-col items-center justify-center">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {corrosionCards.map((_, idx) => (
              <span
                key={idx}
                className={`w-4 h-4 rounded-full border-2 ${idx === step ? 'bg-blue-500 border-blue-700' : 'bg-blue-100 border-blue-300'} transition-all`}
              />
            ))}
          </div>
          {/* Card */}
          <div className="bg-white rounded-xl shadow p-6 md:p-10 space-y-4 flex flex-col items-center w-full">
            <div className="text-4xl mb-2">{corrosionCards[step].icon}</div>
            <h2 className="text-2xl font-bold text-blue-700 text-center">{corrosionCards[step].question}</h2>
            <div className="text-lg text-gray-800 w-full">{corrosionCards[step].answer}</div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between mt-6 w-full">
            <button
              className="px-6 py-2 rounded-full bg-blue-200 text-blue-800 font-semibold shadow hover:bg-blue-300 transition disabled:opacity-50"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Previous
            </button>
            <button
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
              onClick={() => setStep((s) => Math.min(corrosionCards.length - 1, s + 1))}
              disabled={step === corrosionCards.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 