import { Add } from "@mui/icons-material";
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  CardOverflow,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import Alert from "../../../components/Alert";
import {
  useCreateDevice,
  useCreateDeviceStream,
  useListDevices,
} from "../../../api/devices";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  fetchSensor,
  useGetSensor,
  useListSensors,
} from "../../../api/sensors";
import { useQueries } from "react-query";

const Devices = () => {
  const createDevice = useCreateDevice();
  const createStream = useCreateDeviceStream();
  const { data: deviceData, isLoading: listDeviceLoading } = useListDevices({
    refetchInterval: 500, // Refetch every second when the window is in focus
    refetchOnWindowFocus: true, // Refetch when the window is refocused
    refetchIntervalInBackground: false, // Don't refetch when the window is not in focus
  });

  const [open, setOpen] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState("");
  const [streamName, setStreamName] = useState("");
  const [deviceLink, setDeviceLink] = useState("");
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openTwo, setOpenTwo] = useState<boolean>(false);

  useEffect(() => {
    setDeviceName("");
    setDeviceLink("");
    setStreamName("");
  }, [open, openTwo]);

  const processedData = listDeviceLoading
    ? []
    : deviceData.map((device: any) => {
        // Check if sensor.data is already an object or a string that needs parsing.
        if (typeof device.streams === "string") {
          try {
            device.streams = JSON.parse(device.streams);
          } catch (e) {
            console.error("Failed to parse sensor data:", e);
            console.log("Raw sensor data:", device.streams);
          }
        }

        return {
          ...device,
          data: Array.isArray(device.data)
            ? device.data.map((item: any, index: number) => ({
                ...item,
                id: item.id ?? index,
              }))
            : [],
        };
      });

  const handleCreateDevice = async () => {
    try {
      await createDevice.mutateAsync({ deviceId: deviceName });
      setSuccessAlertOpen(true);
      setSuccessMessage("Device created");

      // Hide after 3 seconds
      setTimeout(() => setSuccessAlertOpen(false), 3000);
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage("Error creating device: " + (error as Error).message);

      // Hide after 5 seconds
      setTimeout(() => setErrorAlertOpen(false), 5000);
    }
  };

  const handleCreateStream = async () => {
    console.log("SELECTED SUPPPPPP");
    try {
      await createStream.mutateAsync({
        deviceId: deviceName,
        streamId: streamName,
      });
      setSuccessAlertOpen(true);
      setSuccessMessage("Stream created");

      // Hide after 3 seconds
      setTimeout(() => setSuccessAlertOpen(false), 3000);
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage("Error creating stream: " + (error as Error).message);

      // Hide after 5 seconds
      setTimeout(() => setErrorAlertOpen(false), 5000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSuccessAlertOpen(true);
        setSuccessMessage("Link copied!");
        setTimeout(() => setSuccessAlertOpen(false), 3000);
      })
      .catch((error) => {
        setErrorAlertOpen(true);
        setErrorMessage("Failed to copy: " + (error as Error).message);

        // Hide after 5 seconds
        setTimeout(() => setErrorAlertOpen(false), 5000);
      });
  };

  const columns: GridColDef[] = [
    {
      field: "streamId",
      headerName: "Stream",
      width: 200,
      valueGetter: (params: GridCellParams) => `${params.row.streamId}`,
    },
    {
      field: "streamUrl",
      headerName: "Stream endpoint",
      width: 200,
      valueGetter: (params: GridCellParams) => `${params.row.streamUrl}`,
    },
  ];

  console.log(deviceData);

  return (
    <div>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
        sx={{ marginRight: 2 }}
      >
        New device
      </Button>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setOpenTwo(true)}
      >
        New stream
      </Button>

      {processedData.map((device: any) => {
        return (
          <div style={{ margin: "10px" }} key={device.deviceId}>
            <Routes>
              <Route
                index
                element={
                  <DeviceDataCard
                    deviceName={"mst-" + device.deviceId}
                    deviceImage={device.deviceId}
                    lastUpdated={device.deviceId}
                    routePath={device.deviceId}
                    data={device.streams}
                  />
                }
              />
              <Route
                path={device.deviceId}
                element={
                  <DataGrid
                    rows={device.streams}
                    columns={columns}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.streamId}
                    loading={listDeviceLoading}
                    autoHeight={true}
                  />
                }
              />
            </Routes>
          </div>
        );
      })}

      {/* stream modal */}
      <Modal open={openTwo} onClose={() => setOpenTwo(false)}>
        <ModalDialog>
          <Alert
            successAlertOpen={successAlertOpen}
            successMessage={successMessage}
            errorAlertOpen={errorAlertOpen}
            errorMessage={errorMessage}
          />
          <DialogTitle>Connect a new stream</DialogTitle>
          {createStream.isLoading ? (
            "Creating..."
          ) : deviceLink === "" ? (
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                handleCreateStream();
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Device Name</FormLabel>
                  <Input
                    value={deviceName}
                    onChange={(e) => {
                      setDeviceName(e.target.value);
                    }}
                    autoFocus
                    required
                  />
                  <FormLabel>Stream name</FormLabel>
                  <Input
                    value={streamName}
                    onChange={(e) => {
                      setStreamName(e.target.value);
                    }}
                    autoFocus
                    required
                  />
                </FormControl>
                <Button type="submit" disabled={deviceName === ""}>
                  Submit
                </Button>
              </Stack>
            </form>
          ) : (
            <p
              onClick={(e) => copyToClipboard(deviceLink)}
              style={{ cursor: "pointer" }}
            >
              sup
            </p>
          )}
        </ModalDialog>
      </Modal>

      {/* device modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <Alert
            successAlertOpen={successAlertOpen}
            successMessage={successMessage}
            errorAlertOpen={errorAlertOpen}
            errorMessage={errorMessage}
          />
          <DialogTitle>Connect a new device</DialogTitle>
          {createDevice.isLoading ? (
            "Creating..."
          ) : deviceLink === "" ? (
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                handleCreateDevice();
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Device Name</FormLabel>
                  <Input
                    value={deviceName}
                    onChange={(e) => {
                      setDeviceName(e.target.value);
                    }}
                    autoFocus
                    required
                  />
                </FormControl>
                <Button type="submit" disabled={deviceName === ""}>
                  Submit
                </Button>
              </Stack>
            </form>
          ) : (
            <p
              onClick={(e) => copyToClipboard(deviceLink)}
              style={{ cursor: "pointer" }}
            >
              sup
            </p>
          )}
        </ModalDialog>
      </Modal>
    </div>
  );
};

interface CardProps {
  data: any[];
  deviceName: string;
  deviceImage: string;
  lastUpdated: string;
  routePath: string; // The route to navigate to when the card is clicked
}

const DeviceDataCard: React.FC<CardProps> = ({
  routePath,
  deviceName,
  data,
}) => {
  const navigate = useNavigate();
  const { data: sensorData, isLoading: listSensorLoading } = useListSensors();
  let count = 0;
  // console.log("sup2", data);

  // console.log("sup", sensorData);
  if (sensorData) {
    sensorData.forEach((sensor: any) => {
      data.forEach((stream: any) => {
        if (sensor.sensorId === stream.streamId) {
          // console.log("sup", stream.steams);
          count = JSON.parse(sensor.data).length + count;
        } else {
          // console.log("sup2", JSON.parse(sensor.data).length);
        }
      });
      // console.log("sup", sensor);
    });
  }

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(routePath)}
      sx={{
        width: 320,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          cursor: "pointer",
        },
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src="https://cdn.discordapp.com/attachments/757759385618612347/1181833304777957426/rn_image_picker_lib_temp_7f201b5b-7716-44af-b0d2-894f7c0e2073.jpg?ex=65827f09&is=65700a09&hm=043d1f110678ac94ea30bc446da9c9440e02fb878582f402f38a4a3a372a2b21&"
            loading="lazy"
            alt=""
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="title-md">{deviceName}</Typography>
        <Typography level="body-sm">CAMT Lab</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Typography
            level="body-xs"
            fontWeight="md"
            textColor="text.secondary"
          >
            {count} entries
          </Typography>
          <Divider orientation="vertical" />

          <Typography
            level="body-xs"
            fontWeight="md"
            textColor="text.secondary"
          >
            3 real-time streams
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            fontWeight="md"
            textColor="text.secondary"
          >
            1 minute ago
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
};

export default Devices;
