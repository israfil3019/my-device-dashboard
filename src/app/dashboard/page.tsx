'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Dataset {
  DID: string;
  FMW: number;
  TMS: number;
  bvol: number;
  tem1: number;
  hum1: number;
  solr: number;
  prec: number;
  wind: number;
  wins: number;
  lwet: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<Dataset[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch mock dataset
    fetch('/mock/dataset.json')
      .then((res) => res.json())
      .then((response) => setData(response.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load dataset.');
      });
  }, [router]);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dataset Dashboard</h1>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.DID}
            className="p-4 bg-white shadow rounded border"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Device ID: {item.DID}
            </h2>
            <ul className="text-sm text-gray-600">
              <li><strong>FMW:</strong> {item.FMW}</li>
              <li><strong>Timestamp:</strong> {new Date(item.TMS * 1000).toLocaleString()}</li>
              <li><strong>BVol:</strong> {item.bvol}</li>
              <li><strong>Temp:</strong> {item.tem1}°C</li>
              <li><strong>Humidity:</strong> {item.hum1}%</li>
              <li><strong>Solar:</strong> {item.solr}</li>
              <li><strong>Precipitation:</strong> {item.prec}</li>
              <li><strong>Wind Speed:</strong> {item.wind}</li>
              <li><strong>Wind Gust:</strong> {item.wins}</li>
              <li><strong>Leaf Wetness:</strong> {item.lwet}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
