import React, { useState } from "react";
import Table from "../../../components/Table";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card";
import { Box, Button, styled } from "@mui/joy";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { useUploadData } from "../../../api/upload";
import { useListSensors } from "../../../api/sensors";
import Alert from "../../../components/Alert";

interface CardProps {
  data: any[];
  sensorName: string;
  routePath: string; // The route to navigate to when the card is clicked
}

const HiddenFileInput = styled("input")({
  display: "none",
});

const SensorTool = () => {
  const uploadData = useUploadData();
  const { data: rawData, isLoading: listSensorLoading } = useListSensors({
    refetchInterval: 500, // Refetch every second when the window is in focus
    refetchOnWindowFocus: true, // Refetch when the window is refocused
    refetchIntervalInBackground: false, // Don't refetch when the window is not in focus
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const data = Array.isArray(rawData) ? rawData : [];
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };
  const processedData = data.map((sensor) => {
    // Check if sensor.data is already an object or a string that needs parsing.
    if (typeof sensor.data === "string") {
      try {
        sensor.data = JSON.parse(sensor.data);
      } catch (e) {
        console.error("Failed to parse sensor data:", e);
        console.log("Raw sensor data:", sensor.data);
      }
    }

    return {
      ...sensor,
      data: Array.isArray(sensor.data)
        ? sensor.data.map((item: any, index: number) => ({
            ...item,
            id: item.id ?? index,
          }))
        : [],
    };
  });

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
      <Alert
        successAlertOpen={successAlertOpen}
        successMessage={successMessage}
        errorAlertOpen={errorAlertOpen}
        errorMessage={errorMessage}
      />
      {listSensorLoading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {location.pathname === "/dashboard/sensors" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <HiddenFileInput
                accept="*"
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
              />
              <Button variant="solid" color="primary" onClick={handleClick}>
                Choose file
              </Button>
              <Button variant="outlined" color="primary" onClick={handleUpload}>
                Upload
              </Button>
            </Box>
          )}
          {processedData.map((sensor) => {
            return (
              <div style={{ margin: "10px" }} key={sensor.sensorId}>
                <Routes>
                  <Route
                    index
                    element={
                      <DataCard
                        sensorName={"Sensor-" + sensor.displayName}
                        routePath={sensor.displayName}
                        data={sensor.data}
                      />
                    }
                  />
                  <Route
                    path={sensor.displayName}
                    element={<Table data={sensor.data} />}
                  />
                </Routes>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DataCard: React.FC<CardProps> = ({ routePath, sensorName }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 420,
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
          sx={{
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          {sensorName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SensorTool;
