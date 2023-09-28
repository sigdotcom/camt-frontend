import React from "react";
import Table from "../../../components/Table";
import { Route, Routes, useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Sensor } from "../types";
import {
  dhtHumidity,
  dhtTemperature,
  thermocoupleTemperature,
} from "./sensorData";

interface TemperatureCardProps {
  data: any[];
  sensorName: string;
  desiredRange: [number, number]; // [min, max]
  routePath: string; // The route to navigate to when the card is clicked
}

const sensors: Sensor[] = [
  {
    sensorName: "dhtTemperature",
    data: dhtTemperature,
    range: [70, 74],
  },
  {
    sensorName: "dhtHumidity",
    data: dhtHumidity,
    range: [59, 61],
  },
  {
    sensorName: "thermocoupleTemperature",
    data: thermocoupleTemperature,
    range: [65, 70],
  },
];

const SensorTool = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {sensors.map((sensor) => {
        return (
          <div style={{ margin: "10px" }}>
            <Routes>
              <Route
                index
                element={
                  <DataCard
                    sensorName={sensor.sensorName}
                    routePath={sensor.sensorName}
                    data={sensor.data}
                    desiredRange={sensor.range}
                  />
                }
              />
              <Route
                path={sensor.sensorName}
                element={<Table data={sensor.data} />}
              />
            </Routes>
          </div>
        );
      })}
    </div>
  );
};

const DataCard: React.FC<TemperatureCardProps> = ({
  data,
  desiredRange,
  routePath,
  sensorName,
}) => {
  const isWithinRange =
    data.at(-1).temp >= desiredRange[0] && data.at(-1).temp <= desiredRange[1];
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: 320,
        backgroundColor: "#f5f5f5",
        boxShadow: 3,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          cursor: "pointer",
        },
      }}
      onClick={() => navigate(routePath)}
    >
      <CardContent>
        <Typography
          variant="plain"
          sx={{ textAlign: "center", marginBottom: "1rem", fontWeight: "bold" }}
        >
          {sensorName}
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="plain" sx={{ fontSize: "3rem" }}>
            {data.at(-1).temp}°C
          </Typography>
          {isWithinRange ? (
            <CheckCircleOutlineIcon
              fontSize="large"
              style={{ color: "green" }}
            />
          ) : (
            <CancelIcon fontSize="large" color="error" />
          )}
          <Typography variant="plain">
            Desired Range: {desiredRange[0]}°C - {desiredRange[1]}°C
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorTool;
