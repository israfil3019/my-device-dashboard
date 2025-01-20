'use client';

import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import DeviceTabs from './DeviceTabs';

export default function ChartPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [chartData, setChartData] = useState<any[]>([]);

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

  const getChartOptions = (data: any[]) => {
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
          name: 'Temperature',
          type: 'line',
          data: data.map((point: any) => point.tem1),
        },
        {
          name: 'Humidity',
          type: 'line',
          data: data.map((point: any) => point.hum1),
        },
      ],
    };
  };

  return (
    <div className="p-4">
      <DeviceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        devices={['all', '25_225', '25_226']}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'all' ? (
          <>
            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData('25_225'))}
                style={{ height: '400px', width: '100%' }}
              />
            </div>

            <div className="p-4 bg-white shadow rounded">
              <ReactECharts
                option={getChartOptions(getFilteredData('25_226'))}
                style={{ height: '400px', width: '100%' }}
              />
            </div>
          </>
        ) : (
          <div className="p-4 bg-white shadow rounded">
            <ReactECharts
              option={getChartOptions(
                chartData.filter((point: any) => point.DID === activeTab)
              )}
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
