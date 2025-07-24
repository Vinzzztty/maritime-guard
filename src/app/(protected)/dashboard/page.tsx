"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Add Ship type
interface Ship {
  shipName: string;
  IMO_NUMBER: string;
  status: string;
  location_from: string;
  location_to: string;
  owner: string;
  Year_built: number;
  owner_contact: string;
}

export default function ProtectedHomepage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ships, setShips] = useState<Ship[]>([]); // Use Ship[]
  const [shipsLoading, setShipsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
    } else {
      setLoading(false);
      fetchShips();
    }
  }, [session, status, router]);

  // Refactor fetchShips to set error state
  const fetchShips = async () => {
    try {
      const response = await fetch('/api/ships');
      const data = await response.json();
      
      if (response.ok) {
        setShips(data.ships);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch ships');
        console.error('Failed to fetch ships:', data.error);
      }
    } catch (error) {
      setError('Error fetching ships');
      console.error('Error fetching ships:', error);
    } finally {
      setShipsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'green' : 'gray';
  };

  const getStatusText = (status: string) => {
    return status === 'Active' ? 'Active' : 'Inactive';
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Add error display
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const activeShips = ships.filter(ship => ship.status === 'Active').length;
  const inactiveShips = ships.filter(ship => ship.status === 'Inactive').length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto mt-15">
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-blue-400">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              Welcome back, {session.user?.username || session.user?.email}!
            </h1>
            <p className="text-gray-600">
              Monitor your tobacco shipping fleet and track vessel conditions in real-time.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">🚢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Ships</p>
                  <p className="text-2xl font-bold text-gray-900">{ships.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Ships</p>
                  <p className="text-2xl font-bold text-gray-900">{activeShips}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-400">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <span className="text-2xl">⏸️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive Ships</p>
                  <p className="text-2xl font-bold text-gray-900">{inactiveShips}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sensors Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeShips * 4}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ship Monitoring */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-800">Ship Monitoring Dashboard</h2>
                  <button
                    onClick={() => router.push('/add-ship')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add New Ship
                  </button>
                </div>
                
                {shipsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    <span className="ml-2 text-gray-600">Loading ships...</span>
                  </div>
                ) : ships.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No ships registered yet.</p>
                    <button
                      onClick={() => router.push('/add-ship')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Register Your First Ship
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ships.map((ship, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col gap-2"
                        onClick={() => router.push(`/monitoring-ship/${ship.IMO_NUMBER}`)}
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-3xl shadow-sm">
                            🚢
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-blue-900 mb-1 truncate">{ship.shipName}</h3>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              <span>IMO: {ship.IMO_NUMBER}</span>
                              <span>•</span>
                              <span>{ship.location_from} → {ship.location_to}</span>
                              <span>•</span>
                              <span>Owner: {ship.owner}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${ship.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              ship.status === 'Active'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                            }`}>
                              {getStatusText(ship.status)}
                            </span>
                          </div>
                          <button
                            className="flex items-center gap-1 text-blue-600 font-semibold text-sm bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                            onClick={e => { e.stopPropagation(); router.push(`/monitoring-ship/${ship.IMO_NUMBER}`); }}
                          >
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/add-ship')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add New Ship
                  </button>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    View Reports
                  </button>
                  <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Sensor Settings
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {ships.length > 0 ? (
                    ships.slice(0, 3).map((ship, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 mr-3">🚢</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ship.shipName}</p>
                          <p className="text-xs text-gray-600">Status: {getStatusText(ship.status)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No ships registered yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 