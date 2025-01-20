'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import DeviceTabs from './DeviceTabs';

export default function ChartPage() {
  const [activeTab, setActiveTab] = useState<string>('all'); 
  const [chartData, setChartData] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('2024-12-31');
  const [interval, setInterval] = useState<string>('daily');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/mock/dataset.json');
      const data = await response.json();
      setChartData(data.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'all') {
      setCompareMode(false);
    }
  }, [activeTab]);

  const getFilteredData = (deviceId: string) => {
    const start = new Date(startDate);
    return chartData.filter((point: any) => {
      const pointDate = new Date(point.TMS * 1000);

      let isInInterval = false;
      if (interval === 'daily') {
        isInInterval = pointDate.toDateString() === start.toDateString();
      } else if (interval === 'weekly') {
        const diff = (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        isInInterval = diff >= 0 && diff < 7;
      } else if (interval === 'monthly') {
        const diff = (pointDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        isInInterval = diff >= 0 && diff < 30;
      }

      const isDeviceMatch = deviceId === 'all' || point.DID === deviceId;

      return isInInterval && isDeviceMatch;
    });
  };

  const getChartOptions = (data: any[], deviceId?: string) => {
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Temperature', 'Humidity'] },
      xAxis: {
        type: 'category',
        data: data.map((point: any) =>
          new Date(point.TMS * 1000).toLocaleString()
        ),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: `${deviceId || 'All'} Temperature`,
          type: 'line',
          data: data.map((point: any) => point.tem1),
          markLine: {
            data: [
              { type: 'min', name: 'Min Temperature' },
              { type: 'max', name: 'Max Temperature' },
            ],
            label: {
              show: true,
              formatter: '{b}: {c}',
            },
          },
        },
        {
          name: `${deviceId || 'All'} Humidity`,
          type: 'line',
          data: data.map((point: any) => point.hum1),
          markLine: {
            data: [
              { type: 'min', name: 'Min Humidity' },
              { type: 'max', name: 'Max Humidity' },
            ],
            label: {
              show: true,
              formatter: '{b}: {c}',
            },
          },
        },
      ],
    };
  };

  const getCombinedChartOptions = () => {
    const data225 = getFilteredData('25_225');
    const data226 = getFilteredData('25_226');

    return {
      tooltip: { trigger: 'axis' },
      legend: {
        data: [
          '25_225 Temperature',
          '25_225 Humidity',
          '25_226 Temperature',
          '25_226 Humidity',
        ],
      },
      xAxis: {
        type: 'category',
        data: chartData.map((point: any) =>
          new Date(point.TMS * 1000).toLocaleString()
        ),
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '25_225 Temperature',
          type: 'line',
          data: data225.map((point: any) => point.tem1),
        },
        {
          name: '25_225 Humidity',
          type: 'line',
          data: data225.map((point: any) => point.hum1),
        },
        {
          name: '25_226 Temperature',
          type: 'line',
          data: data226.map((point: any) => point.tem1),
        },
        {
          name: '25_226 Humidity',
          type: 'line',
          data: data226.map((point: any) => point.hum1),
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <DeviceTabs
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
          devices={['all', '25_225', '25_226']}
        />
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`px-4 py-2 rounded ${
            compareMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          disabled={activeTab !== 'all'}
        >
          Compare Devices
        </button>
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Interval</label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div
        className={`grid ${
          activeTab === 'all' && !compareMode
            ? 'grid-cols-1 md:grid-cols-2 gap-6'
            : 'grid-cols-1'
        }`}
      >
        {compareMode ? (
          <div className="p-4 bg-white shadow rounded">
            <ReactECharts
              option={getCombinedChartOptions()}
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        ) : activeTab === 'all' ? (
          <>
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData('25_225'), '25_225')}
                style={{ height: '400px', width: '100%' }}
              />
            </div>
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData('25_226'), '25_226')}
                style={{ height: '400px', width: '100%' }}
              />
            </div>
          </>
        ) : (
          <div className="p-4 bg-white shadow rounded">
            <ReactECharts
              option={getChartOptions(getFilteredData(activeTab), activeTab)}
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
