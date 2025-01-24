"use client";

import ReactECharts from "echarts-for-react";

interface EChartWrapperProps {
  option: any; // ECharts option object
  className?: string; // Additional CSS classes for styling
  height?: number | string; // Height of the chart container
}

const EChartWrapper: React.FC<EChartWrapperProps> = ({
  option,
  className = "",
  height = "400px",
}) => {
  return (
    <div className={`p-4 bg-white shadow rounded ${className}`}>
      <ReactECharts
        option={option}
        style={{ height, width: "100%" }}
        data-testid="echarts-mock"
      />
    </div>
  );
};

export default EChartWrapper;
