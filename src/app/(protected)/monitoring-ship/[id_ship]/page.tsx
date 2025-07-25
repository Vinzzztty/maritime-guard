"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useSession } from "next-auth/react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// import zoomPlugin from 'chartjs-plugin-zoom'; // Uncomment after installing chartjs-plugin-zoom
import SensorsCard from "./SensorsCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  // zoomPlugin,
);

function getOverallQuality(sensors: any[]) {
  if (sensors.some(s => s.status === "Critical")) return { label: "Critical", color: "red" };
  if (sensors.some(s => s.status === "Warning")) return { label: "Warning", color: "yellow" };
  return { label: "Good", color: "green" };
}

export default function MonitoringShipPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [ship, setShip] = useState<any>(null);
  const [shipStatus, setShipStatus] = useState<boolean>(true); // true = on, false = off
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sensorHistory, setSensorHistory] = useState<any[]>([]);
  const isFirstSensorLoad = useRef(true);

  // State for device statuses from ship_monitor
  const [deviceStatuses, setDeviceStatuses] = useState<{device1?: string, device2?: string, device3?: string, device4?: string}>({});
  const [deviceStatusLoading, setDeviceStatusLoading] = useState(true);
  const [deviceStatusError, setDeviceStatusError] = useState<string | null>(null);

  const shipId = params.id_ship as string;

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Fetch ship data from API
    const fetchShipData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        setError(null);
        const response = await fetch(`/api/ships/${shipId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/dashboard");
            return;
          }
          throw new Error('Failed to fetch ship data');
        }
        const shipData = await response.json();
        setShip(shipData);
        setShipStatus(shipData.status === 'Active');
      } catch (err) {
        console.error('Error fetching ship data:', err);
        setError('Failed to load ship data. Please try again.');
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    // Fetch sensor history from backend (now via Next.js API proxy)
    const fetchSensorHistory = async () => {
      try {
        const limit = isFirstSensorLoad.current ? 200 : 50;
        const response = await fetch(`/api/monitor_ship_log/${shipId}?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch sensor history');
        const data = await response.json();
        // If the backend returns an array directly, use it; otherwise, fallback to .sensorHistory
        const parsed = (Array.isArray(data) ? data : data.sensorHistory || []).map((entry: any) => ({
          ...entry,
          sensor1: entry.sensor1 !== undefined ? Number(entry.sensor1) : undefined,
          sensor2: entry.sensor2 !== undefined ? Number(entry.sensor2) : undefined,
          sensor3: entry.sensor3 !== undefined ? Number(entry.sensor3) : undefined,
          sensor4: entry.sensor4 !== undefined ? Number(entry.sensor4) : undefined,
        }));
        setSensorHistory(parsed);
        isFirstSensorLoad.current = false;
      } catch (err) {
        console.error('Error fetching sensor history:', err);
      }
    };

    fetchShipData(true); // Initial load shows spinner
    fetchSensorHistory();

    const fetchDeviceStatuses = async () => {
      setDeviceStatusLoading(true);
      setDeviceStatusError(null);
      try {
        const res = await fetch(`/api/ship_monitor/${shipId}`);
        if (!res.ok) throw new Error('Failed to fetch device statuses');
        const data = await res.json();
        setDeviceStatuses({
          device1: data.device1,
          device2: data.device2,
          device3: data.device3,
          device4: data.device4,
        });
      } catch (err: any) {
        setDeviceStatusError(err.message || 'Failed to fetch device statuses');
        setDeviceStatuses({});
      } finally {
        setDeviceStatusLoading(false);
      }
    };
    fetchDeviceStatuses();
    // Removed polling/interval logic
    return () => {};
  }, [session, status, router, shipId]);

  // Delayed spinner effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setShowSpinner(true), 400); // Show spinner only if loading > 400ms
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Add manual refresh state
  const [refreshing, setRefreshing] = useState(false);
  const handleRefreshSensorHistory = async () => {
    setRefreshing(true);
    try {
      const limit = 60;
      const response = await fetch(`/api/monitor_ship_log/${shipId}?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch sensor history');
      const data = await response.json();
      const parsed = (Array.isArray(data) ? data : data.sensorHistory || []).map((entry: any) => ({
        ...entry,
        sensor1: entry.sensor1 !== undefined ? Number(entry.sensor1) : undefined,
        sensor2: entry.sensor2 !== undefined ? Number(entry.sensor2) : undefined,
        sensor3: entry.sensor3 !== undefined ? Number(entry.sensor3) : undefined,
        sensor4: entry.sensor4 !== undefined ? Number(entry.sensor4) : undefined,
      }));
      setSensorHistory(parsed);
    } catch (err) {
      console.error('Error refreshing sensor history:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!ship || updatingStatus) return;

    const newStatus = !shipStatus;
    setUpdatingStatus(true);

    try {
      const response = await fetch(`/api/ships/${shipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus ? 'Active' : 'Inactive'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ship status');
      }

      const result = await response.json();
      
      // Update local state
      setShipStatus(newStatus);
      setShip((prevShip: any) => ({
        ...prevShip,
        status: newStatus ? 'Active' : 'Inactive'
      }));

      // Optional: Show success message
      console.log(result.message);
      
    } catch (err) {
      console.error('Error updating ship status:', err);
      setError('Failed to update ship status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if ((loading || status === "loading") && showSpinner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading ship data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!ship) {
    return null;
  }

  // Only keep the most recent 60 sensor history entries for visualization
  const recentSensorHistory = sensorHistory.slice(0, 60);

  // Use device1, device2, device3, device4 from deviceStatuses as status values
  const allStatuses = [deviceStatuses.device1, deviceStatuses.device2, deviceStatuses.device3, deviceStatuses.device4].filter(Boolean);

  // Debug logs
  console.log('deviceStatuses', deviceStatuses);
  console.log('allStatuses', allStatuses);

  // Determine overall status
  let overallStatus = "Unknown";
  if (allStatuses.length === 0) {
    overallStatus = "Unknown";
  } else if (allStatuses.includes("High")) {
    overallStatus = "High";
  } else if (allStatuses.includes("Medium")) {
    overallStatus = "Medium";
  } else if (allStatuses.every(status => status === "Low")) {
    overallStatus = "Low";
  }
  console.log('overallStatus', overallStatus);

  const quality = {
    label: overallStatus === "High" ? "Critical"
          : overallStatus === "Medium" ? "Warning"
          : overallStatus === "Low" ? "Good"
          : "Unknown",
    color: overallStatus === "High" ? "red"
          : overallStatus === "Medium" ? "yellow"
          : overallStatus === "Low" ? "green"
          : "gray"
  };

  // Prepare data for line chart visualization (last 60 entries)
  const chartLabels = recentSensorHistory.map(entry => new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const sensor1Data = recentSensorHistory.map(entry => entry.sensor1);
  const sensor2Data = recentSensorHistory.map(entry => entry.sensor2);
  const sensor3Data = recentSensorHistory.map(entry => entry.sensor3);
  const sensor4Data = recentSensorHistory.map(entry => entry.sensor4);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Sensor 1 Humidity',
        data: sensor1Data,
        borderColor: 'rgba(59,130,246,1)', // blue-500
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.4,
      },
      {
        label: 'Sensor 2 pH',
        data: sensor2Data,
        borderColor: 'rgba(16,185,129,1)', // green-500
        backgroundColor: 'rgba(16,185,129,0.1)',
        tension: 0.4,
      },
      {
        label: 'Sensor 3 Conductivity',
        data: sensor3Data,
        borderColor: 'rgba(234,179,8,1)', // yellow-500
        backgroundColor: 'rgba(234,179,8,0.1)',
        tension: 0.4,
      },
      {
        label: 'Sensor 4 Dew point',
        data: sensor4Data,
        borderColor: 'rgba(239,68,68,1)', // red-500
        backgroundColor: 'rgba(239,68,68,0.1)',
        tension: 0.4,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true, mode: 'index' as const, intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time' },
        ticks: { autoSkip: true, maxTicksLimit: 12 },
      },
      y: {
        title: { display: true, text: 'Sensor Value' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      <div className="flex-1 py-12 px-4 w-full mt-5 md:mt-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="mb-4 inline-flex items-center text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow-lg">
              {ship.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>IMO: {ship.imo}</span>
              <span>•</span>
              <span>Built: {ship.yearBuilt}</span>
              <span>•</span>
              <span>Owner: {ship.owner}</span>
              <span>•</span>
              <span>Location: {ship.location}</span>
            </div>
          </div>

                    {/* Ship Image */}
                    <div className="flex justify-center mb-8">
            <img
              src="/hd_ship.webp"
              alt="Ship"
              className="w-full max-w-md rounded-2xl shadow-lg border border-blue-200 object-cover"
              style={{ maxHeight: 240 }}
            />
          </div>

          {/* Ship Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-400">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Ship Status</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full bg-${
                    shipStatus ? (
                      ship.status === 'Active' ? 'green' : 
                      ship.status === 'Alert' ? 'yellow' : 'red'
                    ) : 'gray'
                  }-500`}></span>
                  <span className="font-semibold text-gray-900">
                    {shipStatus ? ship.status : 'Inactive'}
                  </span>
                </div>
                {/* Toggle Switch */}
                <div className="flex items-center">
                  <button
                    onClick={handleStatusToggle}
                    disabled={updatingStatus}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      shipStatus ? 'bg-blue-600' : 'bg-gray-300'
                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        shipStatus ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {updatingStatus ? 'Updating...' : (shipStatus ? 'ON' : 'OFF')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-400">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Overall Status</h3>
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 rounded-full bg-${quality.color}-500`}></span>
                <span className="font-semibold text-gray-900">{quality.label}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-400">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Active Devices</h3>
              <span className="text-2xl font-bold text-gray-900">{ship.sensors.length}</span>
            </div>
          </div>


          {/* Sensors Grid (Realtime) */}
          <SensorsCard shipId={shipId} shipStatus={shipStatus} />

          {/* Line Chart Visualization for Recent Sensor History */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-400 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-800">Sensor History (Last 60 Entries)</h2>
              <button
                onClick={handleRefreshSensorHistory}
                disabled={refreshing}
                className={`px-4 py-2 rounded-lg font-semibold border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="w-full" style={{ minHeight: 300 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Quality Assessment */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-400">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Predictive Maintenance</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className={`w-6 h-6 rounded-full bg-${
                shipStatus ? quality.color : 'gray'
              }-500 border-2 border-white shadow`}></span>
              <span className={`px-4 py-2 rounded-full text-lg font-bold ${
                !shipStatus ? 'bg-gray-100 text-gray-600 border border-gray-300' :
                quality.label === 'Good' ? 'bg-green-100 text-green-800 border border-green-300' :
                quality.label === 'Warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {shipStatus ? quality.label : 'Offline'}
              </span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              {!shipStatus && "Ship monitoring is currently offline. No sensor data is being collected. Turn on the ship to resume monitoring."}
              {shipStatus && quality.label === "Good" && "All sensors are reporting normal corrosion levels. Hull integrity is good and no immediate action is required."}
              {shipStatus && quality.label === "Warning" && "Some sensors are reporting elevated corrosion levels. Schedule maintenance soon to prevent further deterioration."}
              {shipStatus && quality.label === "Critical" && "Critical corrosion detected! Immediate action required to prevent hull damage. Contact maintenance team immediately."}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 