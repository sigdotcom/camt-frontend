import React, { useState } from "react";
import Table from "../../../components/Table";
import { Route, Routes, useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card";
import { Alert, Box, IconButton } from "@mui/joy";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { Sensor } from "../types";
import {
  dhtHumidity,
  dhtTemperature,
  thermocoupleTemperature,
} from "./sensorData";
import { useUploadData } from "../../../api/upload";

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
  const uploadData = useUploadData();
  const [selectedFile, setSelectedFile] = useState(null);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (selectedFile) {
        await uploadData.mutateAsync({
          file: selectedFile,
        });

        // Trigger the Alert on success
        setSuccessAlertOpen(true);
        setSuccessMessage("File uploaded successfully!");

        // Hide after 3 seconds
        setTimeout(() => setSuccessAlertOpen(false), 3000);
      } else {
        throw new Error("No file selected");
      }
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage("Error uploading file: " + (error as Error).message);

      // Hide after 5 seconds
      setTimeout(() => setErrorAlertOpen(false), 5000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",

        width: "100%",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)", // This will center the box horizontally
          zIndex: 1000, // Ensures the alerts are on top of other elements
        }}
      >
        {successAlertOpen && (
          <Alert
            variant="soft"
            color="success"
            startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
            endDecorator={
              <IconButton
                variant="plain"
                size="sm"
                color="success"
                onClick={() => setSuccessAlertOpen(false)}
              >
                <CloseRoundedIcon />
              </IconButton>
            }
          >
            {successMessage}
          </Alert>
        )}

        {errorAlertOpen && (
          <Alert
            variant="outlined"
            color="danger"
            startDecorator={<AccountCircleRoundedIcon />}
            endDecorator={
              <IconButton
                variant="plain"
                size="sm"
                color="danger"
                onClick={() => setErrorAlertOpen(false)}
              >
                <CloseRoundedIcon />
              </IconButton>
            }
          >
            {errorMessage}
          </Alert>
        )}
      </Box>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ margin: "20px" }}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
        {sensors.map((sensor) => {
          return (
            <div style={{ margin: "10px" }} key={sensor.sensorName}>
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
        maxWidth: 320,
        display: "grid",
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
