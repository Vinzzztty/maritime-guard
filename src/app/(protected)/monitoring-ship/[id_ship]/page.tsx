"use client";
import { useState, useEffect } from "react";
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

const TIMEFRAMES = [
  { label: "1 Day", value: "day" },
  { label: "1 Week", value: "week" },
  { label: "1 Month", value: "month" },
  { label: "3 Month", value: "3month" },
];

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
  const [ship, setShip] = useState<any>(null);
  const [shipStatus, setShipStatus] = useState<boolean>(true); // true = on, false = off
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sensorHistory, setSensorHistory] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | '3month'>('week');

  const shipId = params.id_ship as string;

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    // Fetch ship data from API
    const fetchShipData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/ships/${shipId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Ship not found - redirect to dashboard
            router.push("/dashboard");
            return;
          }
          throw new Error('Failed to fetch ship data');
        }
        
        const shipData = await response.json();
        setShip(shipData);
        // Set initial ship status based on fetched data
        setShipStatus(shipData.status === 'Active');
      } catch (err) {
        console.error('Error fetching ship data:', err);
        setError('Failed to load ship data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch sensor history from backend (now via Next.js API proxy)
    const fetchSensorHistory = async () => {
      try {
        const response = await fetch(`/api/monitor_ship_log/${shipId}?limit=10000`);
        if (!response.ok) throw new Error('Failed to fetch sensor history');
        const data = await response.json();
        // Parse sensor values as numbers
        const parsed = (Array.isArray(data) ? data : data.sensorHistory || []).map((entry: any) => ({
          ...entry,
          sensor1: entry.sensor1 !== undefined ? Number(entry.sensor1) : undefined,
          sensor2: entry.sensor2 !== undefined ? Number(entry.sensor2) : undefined,
          sensor3: entry.sensor3 !== undefined ? Number(entry.sensor3) : undefined,
          sensor4: entry.sensor4 !== undefined ? Number(entry.sensor4) : undefined,
        }));
        setSensorHistory(parsed);
      } catch (err) {
        console.error('Error fetching sensor history:', err);
      }
    };

    fetchShipData();
    fetchSensorHistory();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchSensorHistory, 10000);
    return () => clearInterval(interval);
  }, [session, status, router, shipId]);

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

  if (loading || status === "loading") {
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

  const quality = getOverallQuality(ship.sensors);

  // Map sensorHistory to each sensor for charting
  const getSensorData = (sensorIdx: number) => {
    const now = new Date();
    let points: Date[] = [];
    let labels: string[] = [];
    let count = 0;
    if (timeframe === 'day') {
      count = 24;
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now);
        d.setHours(now.getHours() - i, 0, 0, 0);
        points.push(new Date(d));
        labels.push(d.getHours().toString().padStart(2, '0') + ':00');
      }
    } else if (timeframe === 'week') {
      count = 7;
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        points.push(new Date(d));
        labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      }
    } else if (timeframe === 'month') {
      count = 30;
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        points.push(new Date(d));
        labels.push((d.getMonth() + 1) + '/' + d.getDate());
      }
    } else if (timeframe === '3month') {
      count = 90;
      for (let i = 89; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        points.push(new Date(d));
        labels.push((d.getMonth() + 1) + '/' + d.getDate());
      }
    }
    // Group sensorHistory by point (hour or day)
    const grouped: Record<string, number[]> = {};
    for (const entry of sensorHistory) {
      let key = '';
      if (timeframe === 'day') {
        key = new Date(entry.timestamp).toISOString().slice(0, 13); // hour
      } else {
        key = new Date(entry.timestamp).toISOString().slice(0, 10); // day
      }
      if (!grouped[key]) grouped[key] = [];
      const value = entry[`sensor${sensorIdx}`];
      if (typeof value === 'number') grouped[key].push(value);
    }
    const data = points.map(d => {
      let key = '';
      if (timeframe === 'day') {
        key = d.toISOString().slice(0, 13);
      } else {
        key = d.toISOString().slice(0, 10);
      }
      const values = grouped[key] || [];
      if (values.length === 0) return null;
      return values.reduce((a, b) => a + b, 0) / values.length;
    });
    return {
      data,
      labels,
    };
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
              <h3 className="text-lg font-bold text-blue-800 mb-2">Overall Quality</h3>
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 rounded-full bg-${quality.color}-500`}></span>
                <span className="font-semibold text-gray-900">{quality.label}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-400">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Active Sensors</h3>
              <span className="text-2xl font-bold text-gray-900">{ship.sensors.length}</span>
            </div>
          </div>

          {/* Timeframe Selector Button Group */}
          <div className="mb-8 flex gap-2 items-center justify-end">
            <span className="font-medium text-gray-700 mr-2">Timeframe:</span>
            {TIMEFRAMES.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value as 'day' | 'week' | 'month' | '3month')}
                className={`px-4 py-1 rounded-full border text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                  ${timeframe === tf.value ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                style={{ minWidth: 80 }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Sensors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {ship.sensors.map((sensor: any, idx: number) => (
              <div
                key={sensor.id}
                className={`bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-blue-400 hover:shadow-2xl transition-shadow duration-200 flex flex-col ${!shipStatus ? 'opacity-50' : ''}`}
                style={{ minHeight: 400 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full bg-${
                      shipStatus ? sensor.color : 'gray'
                    }-500 border-2 border-white shadow`}></span>
                    <span className={`font-bold text-lg ${
                      shipStatus ? 'text-blue-800' : 'text-gray-500'
                    }`}>{sensor.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    !shipStatus ? 'bg-gray-100 text-gray-600 border border-gray-300' :
                    sensor.status === 'Good' ? 'bg-green-100 text-green-800 border border-green-300' :
                    sensor.status === 'Warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {shipStatus ? sensor.status : 'Inactive'}
                  </span>
                </div>
                
                {/* Current Value */}
                <div className="mb-4">
                  <div className={`text-3xl font-bold ${
                    shipStatus ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {shipStatus ? sensor.value : '--'}
                  </div>
                  <div className={`text-sm ${
                    shipStatus ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {shipStatus ? sensor.unit : 'No data'}
                  </div>
                </div>
                
                {/* Interactive ChartJS Line Chart */}
                {(() => {
                  const { data, labels } = getSensorData(idx + 1);
                  const validData = data.filter(v => v !== null);
                  if (validData.length === 0) {
                    return (
                      <div className="flex items-center justify-center h-60 text-gray-400">No Data</div>
                    );
                  }
                  // Chart.js expects undefined for missing points
                  const chartData = {
                    labels,
                    datasets: [
                      {
                        label: sensor.name,
                        data: data.map(v => v === null ? undefined : v),
                        borderColor: sensor.color === 'yellow' ? 'black' : sensor.color,
                        backgroundColor: 'rgba(0,0,0,0)',
                        pointBackgroundColor: sensor.color === 'yellow' ? 'black' : sensor.color,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#2563eb', // blue-600
                        tension: 0.4,
                        spanGaps: true,
                        borderWidth: 3,
                      },
                    ],
                  };
                  const chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true, mode: 'index' as const, intersect: false },
                      // zoom: {
                      //   pan: { enabled: true, mode: 'x' },
                      //   zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                      // },
                    },
                    hover: { mode: 'nearest' as const, intersect: true },
                    scales: {
                      x: {
                        ticks: {
                          autoSkip: false,
                          maxRotation: 0,
                          minRotation: 0,
                          color: '#888',
                          font: { size: 12, weight: 'bold' as const },
                          callback: function(value: any, index: number) {
                            if (timeframe === 'day') {
                              return index % 3 === 0 ? labels[index] : '';
                            } else if (timeframe === 'week') {
                              return labels[index];
                            } else if (timeframe === 'month') {
                              return index % 5 === 0 || index === labels.length - 1 ? labels[index] : '';
                            } else if (timeframe === '3month') {
                              // Show 6 labels: first, every 18th, and last
                              return (index === 0 || index % 18 === 0 || index === labels.length - 1)
                                ? new Date(new Date().setDate(new Date().getDate() - (labels.length - 1 - index))).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
                                : '';
                            }
                            return labels[index];
                          },
                        },
                        grid: { display: true, color: '#e0e7ef' },
                        title: { display: true, text: 'Time', color: '#2563eb', font: { size: 14, weight: 'bold' as const } },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: { color: '#888', font: { size: 12, weight: 'bold' as const } },
                        grid: { color: '#e0e7ef' },
                        title: { display: true, text: sensor.unit, color: '#2563eb', font: { size: 14, weight: 'bold' as const } },
                      },
                    },
                  };
                  // Reset zoom button (future, after plugin install)
                  // <button onClick={() => chartRef.current?.resetZoom()}>Reset Zoom</button>
                  return (
                    <div className="relative w-full" style={{ height: 240, minHeight: 180 }}>
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Quality Assessment */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-400">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Quality Assessment</h2>
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