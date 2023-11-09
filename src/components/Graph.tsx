import { KeyboardArrowDown } from "@mui/icons-material";
import { Select, Option, selectClasses, Stack } from "@mui/joy";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";

export interface GraphProps {
  xAxisData: number[];
  xAxisLabel: string;
  yAxisData: number[];
  yAxisLabel: string;
}

export interface DynamicGraphProps {
  data: Sensor[];
}

interface Sensor {
  sensorId: string;
  displayName: string;
  data: [];
}

interface DataPoint {
  timestamp: string;
  [key: string]: any; // This index signature states that in addition to `timestamp`, any string can be used as a key to access the values of any type
}

const Graph: React.FC<GraphProps> = ({
  xAxisData,
  xAxisLabel,
  yAxisData,
  yAxisLabel,
}) => {
  return (
    <div>
      <LineChart
        xAxis={[{ label: xAxisLabel, data: xAxisData }]}
        series={[
          {
            curve: "catmullRom",
            label: yAxisLabel,
            data: yAxisData,
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
};

const DynamicGraph: React.FC<DynamicGraphProps> = ({ data }) => {
  const [graphData, setGraphData] = useState<GraphProps | null>();
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [sensorVar, setSensorVar] = useState<string>("");
  const [sensorVarValue, setSensorVarValue] = useState<undefined | null>(null);
  const [sensorJson, setSensorJson] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (sensorVar !== "") {
      const timestamps: number[] = sensorJson.map((dataPoint) =>
        parseFloat(dataPoint.timestamp)
      );
      const yValues = sensorJson.map((dataPoint) => {
        // Access the property using the name stored in sensorVar
        const value = dataPoint[sensorVar];
        return parseFloat(value);
      });

      setGraphData({
        xAxisData: timestamps,
        xAxisLabel: "Time",
        yAxisData: yValues,
        yAxisLabel: sensorVar,
      });
    }
  }, [sensorVar, sensorJson]);

  const handleSensorChange = async (value: any) => {
    if (value) {
      setSensor(value);
      setSensorJson(JSON.parse(value.data));

      //Deletes sensor variable options for new sensor
      setSensorVarValue(null);

      //Deletes graph
      setGraphData(null);
    }
  };

  const handledSensorVarChange = async (value: any) => {
    if (value) {
      setSensorVar(value);

      //Setup reset command
      setSensorVarValue(undefined);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Select
          placeholder="Select sensor..."
          sx={{
            width: 200,

            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
          indicator={<KeyboardArrowDown />}
          defaultValue={data ? data : null}
          onChange={(event, value) => handleSensorChange(value)}
        >
          {data.map((item, index) => (
            <Option key={index} value={item}>
              Sensor-{item.displayName}
            </Option>
          ))}
        </Select>
        {sensor !== null ? (
          <Select
            sx={{
              width: 200,
              [`& .${selectClasses.indicator}`]: {
                transition: "0.2s",
                [`&.${selectClasses.expanded}`]: {
                  transform: "rotate(-180deg)",
                },
              },
            }}
            value={sensorVarValue}
            indicator={<KeyboardArrowDown />}
            placeholder="Select variable"
            defaultValue={data ? data : null}
            onChange={(event, value) => handledSensorVarChange(value)}
          >
            {Object.keys(sensorJson[0]).map((key, index) => (
              <Option key={index} value={key}>
                {key}
              </Option>
            ))}
          </Select>
        ) : (
          <></>
        )}
      </Stack>

      {graphData ? (
        <Graph
          xAxisData={graphData.xAxisData}
          xAxisLabel={graphData.xAxisLabel}
          yAxisData={graphData.yAxisData}
          yAxisLabel={graphData.yAxisLabel}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export { Graph, DynamicGraph };
