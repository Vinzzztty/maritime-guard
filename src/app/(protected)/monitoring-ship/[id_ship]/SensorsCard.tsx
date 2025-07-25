"use client";
import { useEffect, useRef, useState } from "react";

interface Sensor {
  id: number;
  name: string;
  status: string;
  color: string;
  value: number | null;
  unit: string;
  timestamp?: string; // Add timestamp if available from API
}

interface DeviceStatus {
  device1?: string;
  device2?: string;
  device3?: string;
  device4?: string;
}

interface SensorsCardProps {
  shipId: string;
  shipStatus: boolean;
}

export default function SensorsCard({ shipId, shipStatus }: SensorsCardProps) {
  const [devices, setDevices] = useState<any[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch device status from ship_monitor
  const fetchDeviceStatus = async () => {
    try {
      const res = await fetch(`/api/ships/${shipId}`);
      if (!res.ok) throw new Error('Failed to fetch device status');
      const data = await res.json();
      if (data && data.ship_monitor) {
        setDeviceStatus({
          device1: data.ship_monitor.device1,
          device2: data.ship_monitor.device2,
          device3: data.ship_monitor.device3,
          device4: data.ship_monitor.device4,
        });
      } else if (data.device1 || data.device2 || data.device3 || data.device4) {
        setDeviceStatus({
          device1: data.device1,
          device2: data.device2,
          device3: data.device3,
          device4: data.device4,
        });
      }
    } catch (err) {
      // ignore status error, just don't show
    }
  };

  const fetchSensors = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      setError(null);
      const response = await fetch(`/api/ships/${shipId}/latest`);
      if (!response.ok) throw new Error("Failed to fetch sensors");
      const data = await response.json();
      console.log('SensorsCard API response:', data); // Debug log
      if (!data.devices || !Array.isArray(data.devices)) {
        setDevices([]);
        setError('No devices found for this ship.');
      } else {
        setDevices(data.devices);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch sensors");
      setDevices([]);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceStatus();
    fetchSensors();
    // No interval, only fetch on mount or refresh
  }, [shipId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-2xl h-32 border-t-4 border-blue-200"
          />
        ))}
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }
  if (!devices.length) {
    return <div className="text-center text-gray-500 py-8">No devices or sensors found for this ship.</div>;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-800">Sensors</h3>
        <button
          onClick={() => fetchSensors(true)}
          disabled={refreshing}
          className={`px-4 py-2 rounded-lg font-semibold border border-blue-500 text-blue-700 bg-white hover:bg-blue-50 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8`}>
        {devices.map((device, idx) => {
          // Get status for this device from ship_monitor
          const status = deviceStatus[`device${idx + 1}` as keyof DeviceStatus];
          return (
            <div
              key={device.device}
              className={`bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-blue-400 hover:shadow-2xl transition-shadow duration-200 flex flex-col`}
              style={{ minHeight: 180 }}
            >
              <div className="flex flex-col items-center justify-center h-full w-full">
                <span className="font-bold text-lg text-blue-800 mb-2">{device.name} ({device.device})</span>
                {status && (
                  <span className={`mb-4 px-3 py-1 rounded-full text-sm font-bold ${
                    status === 'High' ? 'bg-red-100 text-red-800 border border-red-300' :
                    status === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    status === 'Low' ? 'bg-green-100 text-green-800 border border-green-300' :
                    'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {status}
                  </span>
                )}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {device.sensors.map((sensor: any) => (
                    <div key={sensor.id} className="flex flex-col items-center p-2 border rounded-lg bg-blue-50">
                      <span className="text-xs text-gray-500 mb-1">Sensor {sensor.id}</span>
                      <span className="text-xl font-bold text-gray-900">{sensor.value !== null && sensor.value !== undefined ? sensor.value : '--'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 