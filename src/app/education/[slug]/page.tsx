import { notFound } from "next/navigation";

const BLOG_POSTS = {
  "why-corrosion-matters": {
    title: "Why Corrosion Matters in Maritime Industry",
    content: `Corrosion is a major threat to the structural integrity and safety of ships. Early detection helps prevent costly repairs, reduces downtime, and ensures compliance with maritime regulations. Our platform enables ship owners to monitor hull condition in real time, making maintenance proactive rather than reactive.`,
  },
  "sensor-technology-explained": {
    title: "How Our Sensor Technology Works",
    content: `Our advanced sensors are designed for harsh marine environments. They continuously collect data on hull condition and transmit it to our web application. This allows for real-time monitoring, early warnings, and data-driven decision making for ship maintenance.`,
  },
  "compliance-and-reporting": {
    title: "Compliance & Reporting Simplified",
    content: `Meeting maritime compliance standards is easier with our platform. We provide automated reporting tools that generate compliance-ready documents, helping you stay ahead of regulations and share insights with your team or authorities.`,
  },
};

export default async function EducationBlogDetail({ params }: { params: { slug: string } }) {
  // params is now always available, but making the function async silences the warning
  const post = BLOG_POSTS[params.slug as keyof typeof BLOG_POSTS];
  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full bg-blue-50 rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">{post.title}</h1>
        <p className="text-lg text-gray-700 whitespace-pre-line">{post.content}</p>
        <a href="/" className="mt-8 inline-block text-blue-600 hover:underline font-semibold">← Back to Home</a>
      </div>
    </div>
  );
} 