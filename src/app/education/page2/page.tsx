"use client"
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState } from 'react';

const corrosionCards = [
  {
    icon: "👋",
    question: "Welcome to Steel Corrosion on Ship Hulls",
    answer: (
      <>
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Ready to learn about corrosion and ship safety?</p>
          <p className="text-lg">Explore each card to understand the causes, types, impacts, and prevention of steel corrosion on ship hulls. Use the <span className="font-bold">Next</span> button to get started!</p>
        </div>
      </>
    ),
  },
  {
    icon: "🔎",
    question: "What is steel corrosion on ship hulls?",
    answer: (
      <>
        Steel corrosion on ship hulls is the process of degradation or damage to the steel used in ship structures due to chemical or electrochemical reactions with the marine environment. This includes seawater, oxygen, and high humidity, which lead to the formation of rust and a gradual reduction in the material’s strength.
      </>
    ),
  },
  {
    icon: "🌊",
    question: "What causes steel corrosion on ship hulls?",
    answer: (
      <>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Marine environment:</b> Seawater contains high levels of salt, especially sodium chloride (NaCl), making it a good conductor of electricity.</li>
          <li><b>Chemical reaction:</b> When steel is exposed to seawater and oxygen, a chemical reaction occurs that slowly “eats away” the metal and forms rust.</li>
          <li><b>Environmental factors:</b> Temperature differences, humidity, and pressure variations accelerate corrosion.</li>
          <li><b>Protective coating damage:</b> Scratches or damage to paint make steel more vulnerable.</li>
          <li><b>Galvanic corrosion:</b> When two different metals are placed close together, one corrodes faster.</li>
        </ul>
        <div className="bg-blue-200 border-l-4 border-blue-500 p-4 rounded">
          <b>Summary:</b> Corrosion is caused by salty seawater, oxygen, scratches on the protective coating, and the unstable and humid marine environment.
        </div>
      </>
    ),
  },
  {
    icon: "🧪",
    question: "Types of corrosion on ship hull steel",
    answer: (
      <ul className="list-decimal list-inside space-y-2">
        <li><b>Uniform corrosion:</b> Rust spreads evenly across the steel surface.</li>
        <li><b>Pitting corrosion:</b> Creates small but deep holes, often not visible externally.</li>
        <li><b>Crevice corrosion:</b> Occurs in narrow gaps like joints, bolts, or folded plates.</li>
        <li><b>Galvanic corrosion:</b> When two dissimilar metals are in contact in seawater.</li>
        <li><b>Microbiologically Influenced Corrosion (MIC):</b> Caused by marine bacteria.</li>
        <li><b>Erosion corrosion:</b> Where seawater flows quickly over steel surfaces.</li>
        <li><b>Stress corrosion cracking:</b> Steel under tension exposed to a corrosive environment.</li>
        <li><b>Intergranular corrosion:</b> Attacks the boundaries of metal grains.</li>
      </ul>
    ),
  },
  {
    icon: "⚠️",
    question: "What are the impacts of corrosion on ship hulls?",
    answer: (
      <>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li>Steel thinning reduces structural strength, risking leaks or failure.</li>
          <li>Permanent structural damage requires costly repairs or replacements.</li>
          <li>More frequent docking for inspection, cleaning, and repainting.</li>
          <li>Undetected corrosion can lead to sudden leaks or sinking.</li>
        </ul>
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mt-2 rounded text-lg flex items-center gap-2">
          <span className="font-semibold text-yellow-800">Warning:</span> Corrosion can pose risks to the ship, crew, and marine environment.
        </div>
      </>
    ),
  },
  {
    icon: "🔬",
    question: "Mechanism of corrosion",
    answer: (
      <>
        <p className="mb-2">
          The corrosion mechanism of steel hulls is similar to rust formation on iron but more aggressive due to the marine environment. It involves electrochemical reactions where steel (iron alloy) interacts with seawater.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Parts of the steel surface act as an anode and others as a cathode.</li>
          <li>At the anode, iron atoms lose electrons and become iron ions (Fe²⁺).</li>
          <li>Electrons flow to the cathode, react with oxygen and water to form hydroxide ions (OH⁻).</li>
          <li>These ions combine to form hydrated iron oxide (Fe₂O₃·xH₂O), known as rust.</li>
          <li>Seawater accelerates this process due to its electrolytic nature.</li>
        </ul>
      </>
    ),
  },
  {
    icon: "🛡️",
    question: "Methods to slow down the corrosion of ship hull steel",
    answer: (
      <ul className="list-disc list-inside space-y-2">
        <li><b>Protective coatings:</b> Applying anti-rust paint to create a barrier.</li>
        <li><b>Cathodic protection:</b> Attaching sacrificial anodes like zinc or aluminum.</li>
        <li><b>Corrosion inhibitors:</b> Adding chemicals to slow down corrosion reactions.</li>
        <li><b>Monitoring systems:</b> Using sensors and digital monitoring tools for early detection.</li>
      </ul>
    ),
  },
  {
    icon: "📡",
    question: "Technologies used to monitor corrosion rates in ship hull steel",
    answer: (
      <>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li>Corrosion sensors to measure moisture, temperature, pH, and conductivity.</li>
          <li>IoT-based monitoring systems for real-time data transmission.</li>
          <li>Ultrasonic thickness gauges for non-destructive steel thickness measurement.</li>
          <li>Underwater cameras and ROVs for remote inspection.</li>
        </ul>
        <p>
          These technologies help ship operators detect corrosion early, avoid major damage, and ensure safe operation.
        </p>
      </>
    ),
  },
  {
    icon: "💡",
    question: "Final Thoughts",
    answer: (
      <div className="text-center">
        <blockquote className="italic text-blue-900 text-lg mb-2">
          "Early detection and proactive maintenance are the keys to keeping your fleet safe and efficient."
        </blockquote>
        <p className="text-blue-700 font-semibold">Thank you for learning about steel corrosion on ship hulls!</p>
      </div>
    ),
  },
];

export default function EducationPage2() {
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