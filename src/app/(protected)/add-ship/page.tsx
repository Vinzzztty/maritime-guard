"use client";

import React, { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from 'next/navigation';

export default function AddShipPage() {
  const [form, setForm] = useState({
    shipName: '',
    IMO_NUMBER: '',
    Year_built: '',
    owner: '',
    location_from: '',
    location_to: '',
    Coordinate_x: '',
    Coordinate_y: '',
    owner_contact: '',
    status: 'Inactive', // Default to Inactive
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/ships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to register ship");
      }
      
      setSuccess('Ship registered successfully! Redirecting to dashboard...');
      
      // Reset form
      setForm({
        shipName: '',
        IMO_NUMBER: '',
        Year_built: '',
        owner: '',
        location_from: '',
        location_to: '',
        Coordinate_x: '',
        Coordinate_y: '',
        owner_contact: '',
        status: 'Inactive',
      });
      
      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <div className="flex-1 py-12 px-4 w-full mt-10 md:mt-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="mb-4 inline-flex items-center text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Add New Ship</h1>
            <p className="text-gray-600">Register a new ship to your monitoring fleet</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-400"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ship Name */}
              <div className="md:col-span-2">
                <label htmlFor="shipName" className="block text-sm font-medium text-gray-700 mb-1">
                  Ship Name *
                </label>
                <input
                  id="shipName"
                  name="shipName"
                  value={form.shipName}
                  onChange={handleChange}
                  placeholder="e.g., MV Tobacco Star"
                  required
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* IMO Number */}
              <div className="md:col-span-2">
                <label htmlFor="IMO_NUMBER" className="block text-sm font-medium text-gray-700 mb-1">
                  IMO Number *
                </label>
                <input
                  id="IMO_NUMBER"
                  name="IMO_NUMBER"
                  value={form.IMO_NUMBER}
                  onChange={handleChange}
                  placeholder="e.g., IMO1234567"
                  required
                  minLength={7}
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Year Built */}
              <div>
                <label htmlFor="Year_built" className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built *
                </label>
                <input
                  id="Year_built"
                  name="Year_built"
                  value={form.Year_built}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  required
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Owner */}
              <div>
                <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                  Owner *
                </label>
                <input
                  id="owner"
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  placeholder="e.g., Tobacco Shipping Co."
                  required
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Location From */}
              <div>
                <label htmlFor="location_from" className="block text-sm font-medium text-gray-700 mb-1">
                  Location From *
                </label>
                <input
                  id="location_from"
                  name="location_from"
                  value={form.location_from}
                  onChange={handleChange}
                  placeholder="e.g., Jakarta"
                  required
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Location To */}
              <div>
                <label htmlFor="location_to" className="block text-sm font-medium text-gray-700 mb-1">
                  Location To *
                </label>
                <input
                  id="location_to"
                  name="location_to"
                  value={form.location_to}
                  onChange={handleChange}
                  placeholder="e.g., Singapore"
                  required
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Coordinate X */}
              <div>
                <label htmlFor="Coordinate_x" className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinate X (Longitude) *
                </label>
                <input
                  id="Coordinate_x"
                  name="Coordinate_x"
                  value={form.Coordinate_x}
                  onChange={handleChange}
                  placeholder="e.g., 106.8456"
                  required
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Coordinate Y */}
              <div>
                <label htmlFor="Coordinate_y" className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinate Y (Latitude) *
                </label>
                <input
                  id="Coordinate_y"
                  name="Coordinate_y"
                  value={form.Coordinate_y}
                  onChange={handleChange}
                  placeholder="e.g., -6.2088"
                  required
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Owner Contact */}
              <div className="md:col-span-2">
                <label htmlFor="owner_contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Contact *
                </label>
                <input
                  id="owner_contact"
                  name="owner_contact"
                  value={form.owner_contact}
                  onChange={handleChange}
                  placeholder="e.g., +62 812-3456-7890"
                  required
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Ship Status */}
              <div className="md:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Ship Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full border border-blue-300 bg-blue-50 text-blue-900 font-medium rounded-lg py-2.5 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Inactive">Inactive (Default)</option>
                  <option value="Active">Active</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  New ships default to Inactive. Change to Active when ready to monitor.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering Ship...
                  </>
                ) : (
                  'Register Ship'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
} 