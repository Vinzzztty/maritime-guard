import React from "react";

const Footer = () => (
  <footer className="bg-blue-900 text-white py-10 px-4 mt-auto" id="contact">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <span className="font-bold text-lg">MaritimeGuard</span> &copy; {new Date().getFullYear()}<br />
        <span className="text-sm">All rights reserved.</span>
      </div>
      <div className="flex gap-6 mt-2 sm:mt-0">
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
      </div>
    </div>
  </footer>
);

export default Footer; 