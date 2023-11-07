import React from "react";
import { useListSensors } from "../../../api/sensors";
import { LineChart } from "@mui/x-charts";

interface MachineData {
  timestamp: string;
  nozzle_temperature: string;
  chamber_pressure: string;
}

interface ProcessedData {
  xAxisData: number[];
  seriesData: {
    nozzleTemps: number[];
    chamberPressures: number[];
  };
}

const Data: React.FC = () => {
  const [processedData, setProcessedData] =
    React.useState<ProcessedData | null>(null);

  const { data: rawData, isLoading: listSensorLoading } = useListSensors({
    refetchInterval: 500,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  });

  React.useEffect(() => {
    if (rawData && rawData.length > 0) {
      if (rawData[0] && rawData[0].data) {
        try {
          const dataToProcess = rawData[0].data;
          const processed = parseAndProcessData(dataToProcess);
          setProcessedData(processed);
        } catch (e) {
          console.error("Failed to parse sensor data:", e);
        }
      }
    }
  }, [rawData]);

  if (
    listSensorLoading ||
    !processedData ||
    !processedData.seriesData ||
    !processedData.xAxisData
  ) {
    return <div>Loading...</div>;
  }
  console.log(processedData);
  // At this point, processedData is guaranteed to be non-null
  return (
    <div>
      <LineChart
        xAxis={[{ label: "Timestamp", data: processedData.xAxisData }]}
        series={[
          {
            curve: "catmullRom",
            label: "Nozzle Temperature",
            data: processedData.seriesData.nozzleTemps,
          },
        ]}
        width={500}
        height={300}
      />
      <LineChart
        xAxis={[{ label: "Timestamp", data: processedData.xAxisData }]}
        series={[
          {
            curve: "catmullRom",
            label: "Chamber Pressure",
            data: processedData.seriesData.chamberPressures,
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
};

const parseAndProcessData = (jsonString: string): ProcessedData => {
  try {
    const dataArray: MachineData[] = JSON.parse(jsonString);

    // Check if the data is empty or not in expected format
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("Data is empty or not in the expected array format");
    }

    const timestamps: number[] = dataArray.map((entry) =>
      parseFloat(entry.timestamp)
    );
    const nozzleTemps: number[] = dataArray.map((entry) =>
      parseFloat(entry.nozzle_temperature)
    );
    const chamberPressures: number[] = dataArray.map((entry) =>
      parseFloat(entry.chamber_pressure)
    );

    return {
      xAxisData: timestamps,
      seriesData: {
        nozzleTemps,
        chamberPressures,
      },
    };
  } catch (error) {
    console.error("Failed to parse and process data:", error);

    // Return a default object with empty arrays to avoid TypeScript error
    return {
      xAxisData: [0],
      seriesData: {
        nozzleTemps: [0],
        chamberPressures: [0],
      },
    };
  }
};
export default Data;
