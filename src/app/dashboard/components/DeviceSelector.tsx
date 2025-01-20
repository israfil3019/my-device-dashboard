interface Props {
  deviceType: string;
  setDeviceType: (value: string) => void;
  interval: string;
  setInterval: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
}

export default function DeviceSelector({
  deviceType,
  setDeviceType,
  interval,
  setInterval,
  startDate,
  setStartDate,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium">Device Type</label>
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="25_225">Device 25_225</option>
          <option value="25_226">Device 25_226</option>
        </select>
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

      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
    </div>
  );
}
