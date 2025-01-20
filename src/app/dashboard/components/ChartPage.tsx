'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import DeviceTabs from './DeviceTabs';

export default function ChartPage() {
  const [activeTab, setActiveTab] = useState<string>('all'); // State for active device
  const [chartData, setChartData] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState<boolean>(false); // Toggle comparison mode

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/mock/dataset.json');
      const data = await response.json();
      setChartData(data.data);
    };

    fetchData();
  }, []);

  const getFilteredData = (deviceId: string) => {
    return chartData.filter((point: any) => point.DID === deviceId);
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
        },
        {
          name: `${deviceId || 'All'} Humidity`,
          type: 'line',
          data: data.map((point: any) => point.hum1),
        },
      ],
    };
  };

  const getCombinedChartOptions = () => {
    const data225 = getFilteredData('25_225');
    const data226 = getFilteredData('25_226');

    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['25_225 Temperature', '25_225 Humidity', '25_226 Temperature', '25_226 Humidity'] },
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
      {/* Device Tabs and Compare Button */}
      <div className="flex items-center gap-4 mb-4">
        <DeviceTabs
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCompareMode(false); // Disable compare mode when switching tabs
          }}
          devices={['all', '25_225', '25_226']}
        />
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`px-4 py-2 rounded ${
            compareMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Compare Devices
        </button>
      </div>

      <div
        className={`grid ${
          activeTab === 'all' && !compareMode
            ? 'grid-cols-1 md:grid-cols-2 gap-6'
            : 'grid-cols-1'
        }`}
      >
        {compareMode ? (
          // Combined Chart
          <div className="p-4 bg-white shadow rounded">
            <ReactECharts
              option={getCombinedChartOptions()}
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        ) : activeTab === 'all' ? (
          <>
            {/* Chart for Device 25_225 */}
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData('25_225'), '25_225')}
                style={{ height: '400px', width: '100%' }}
              />
            </div>

            {/* Chart for Device 25_226 */}
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData('25_226'), '25_226')}
                style={{ height: '400px', width: '100%' }}
              />
            </div>
          </>
        ) : (
          // Single Chart for Selected Device
          <div className="p-4 bg-white shadow rounded">
            <ReactECharts
              option={getChartOptions(
                chartData.filter((point: any) => point.DID === activeTab),
                activeTab
              )}
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
