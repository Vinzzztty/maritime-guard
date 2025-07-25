"use client"
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState } from 'react';
// If you have react-katex installed, uncomment the next line:
// import 'katex/dist/katex.min.css';
// import { BlockMath } from 'react-katex';

const techCards = [
  {
    icon: "👋",
    question: "Welcome to Ship Hull Corrosion Monitoring Technologies",
    answer: (
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">Explore the latest technologies for monitoring and preventing corrosion on ship hulls.</p>
        <p className="text-lg">Use <span className="font-bold">Next</span> to discover each method and its benefits for maritime safety and efficiency.</p>
      </div>
    ),
  },
  {
    icon: "🛰️",
    question: "Corrosion & Environmental Sensors",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Fungsi:</b> Memantau laju korosi langsung (ER, LPR, kupon berat). Mengawasi faktor lingkungan: RH, pH, konduktivitas, suhu.</li>
          <li><b>Patokan Standar:</b> RH ≈100% → Kondensasi (ASTM D2247). pH &lt; 6 → Korosif; pH 7–9 → Relatif aman (ASTM G1/G31). Konduktivitas &gt; 2000 µS/cm → Lingkungan sangat korosif (ASTM D1125). ΔT ke titik embun ≤ 3 °C → Risiko kondensasi (ASTM G96).</li>
          <li><b>Kelebihan:</b> Data real-time &amp; pemicu korosi terdeteksi lebih awal.</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "🌐",
    question: "IoT Corrosion Monitoring",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Komponen:</b> Sensor → Edge Gateway (LoRaWAN/4G/VSAT) → Cloud/CMMS.</li>
          <li><b>Fitur Utama:</b> Real-time alert &amp; histori tren korosi. OTA firmware update &amp; buffer data offline.</li>
          <li><b>Manfaat:</b> Deteksi korosi tanpa menunggu kapal sandar.</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "📏",
    question: "Ultrasonic Thickness & Corrosion Mapping",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Fungsi:</b> Mengukur ketebalan pelat baja tanpa merusak (non-destructive).</li>
          <li><b>Keunggulan:</b> Identifikasi area penipisan (thinning). C-scan mapping untuk mendeteksi hot-spot thinning dengan presisi.</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "🤖",
    question: "Visual Inspection via ROV & Underwater Drone",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Fungsi:</b> Inspeksi visual lambung kapal di bawah permukaan laut.</li>
          <li><b>Teknologi Tambahan:</b> Laser scaling untuk mengukur pitting atau fouling.</li>
          <li><b>Manfaat:</b> Minim risiko penyelam &amp; inspeksi lebih rutin.</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "💧",
    question: "Dew Point & Condensation Watcher",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Algoritme:</b> <span className="inline-block bg-gray-100 px-2 py-1 rounded font-mono">ΔT = T<sub>surface</sub> - T<sub>dewpoint</sub></span></li>
          <li><b>Aturan:</b> <span className="inline-block bg-gray-100 px-2 py-1 rounded font-mono">ΔT ≤ 3 °C</span> <span className="ml-2">(indikasi kondensasi dan korosi bawah coating)</span></li>
          <li><b>Rujukan:</b> ASTM G96.</li>
        </ul>
        {/*
        If you have react-katex installed, you can use:
        <BlockMath math={String.raw`\Delta T = T_{\text{surface}} - T_{\text{dewpoint}}`} />
        <BlockMath math={String.raw`\Delta T \leq 3\,^\circ\mathrm{C}`}/>
        */}
      </div>
    ),
  },
  {
    icon: "🛡️",
    question: "Protection & Coating Health",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Proteksi Katodik:</b> Monitoring potensial struktur vs Ag/AgCl &amp; arus anoda.</li>
          <li><b>Kesehatan Coating:</b> High-voltage holiday test. EIS (Electrochemical Impedance Spectroscopy).</li>
          <li><b>Hasil:</b> Peta defect → prioritas perbaikan lebih cepat.</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "📊",
    question: "Analytics, AI & Dashboard",
    answer: (
      <div>
        <ul className="list-disc list-inside space-y-2 mb-2">
          <li><b>Rule Engine:</b> Threshold pada RH, pH, konduktivitas, ΔT.</li>
          <li><b>AI/ML:</b> Prediksi Time-To-Repair &amp; Time-To-Thickness-Limit.</li>
          <li><b>Visualisasi:</b> Dashboard traffic-light (Hijau/Kuning/Merah).</li>
        </ul>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded mt-2">
          <b>Contoh Status:</b> RH 68 % ⚠️ | pH 5.8 ⚠️ | Konduktivitas 1200 µS/cm ⚠️ | ΔT 2 °C ⚠️ → Risiko Sedang.
        </div>
      </div>
    ),
  },
  {
    icon: "💡",
    question: "Final Thoughts",
    answer: (
      <div className="text-center">
        <blockquote className="italic text-blue-900 text-lg mb-2">
          "Teknologi monitoring modern membantu menjaga kapal tetap aman, efisien, dan patuh regulasi."
        </blockquote>
        <p className="text-blue-700 font-semibold">Thank you for exploring ship hull corrosion monitoring technologies!</p>
      </div>
    ),
  },
];

export default function EducationPage3() {
  const [step, setStep] = useState(0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 flex flex-col flex-grow justify-center items-center py-20 px-4">
        <div className="max-w-2xl w-full bg-blue-50 rounded-2xl shadow-xl p-8 md:p-12 space-y-8 flex flex-col items-center justify-center">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {techCards.map((_, idx) => (
              <span
                key={idx}
                className={`w-4 h-4 rounded-full border-2 ${idx === step ? 'bg-blue-500 border-blue-700' : 'bg-blue-100 border-blue-300'} transition-all`}
              />
            ))}
          </div>
          {/* Card */}
          <div className="bg-white rounded-xl shadow p-6 md:p-10 space-y-4 flex flex-col items-center w-full">
            <div className="text-4xl mb-2">{techCards[step].icon}</div>
            <h2 className="text-2xl font-bold text-blue-700 text-center">{techCards[step].question}</h2>
            <div className="text-lg text-gray-800 w-full">{techCards[step].answer}</div>
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
              onClick={() => setStep((s) => Math.min(techCards.length - 1, s + 1))}
              disabled={step === techCards.length - 1}
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