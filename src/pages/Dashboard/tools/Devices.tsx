import { Add } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useCreatePresignedUrl } from "../../../api/upload";
import Alert from "../../../components/Alert";

const Devices = () => {
  const createPresignedUrl = useCreatePresignedUrl();
  const [open, setOpen] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceLink, setDeviceLink] = useState("");
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setDeviceName("");
    setDeviceLink("");
  }, [open]);

  const handleCreateLink = async () => {
    try {
      await createPresignedUrl.mutateAsync();
      setDeviceLink(createPresignedUrl.data);
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage("Error creating link: " + (error as Error).message);

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

  return (
    <div>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        New device
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <Alert
            successAlertOpen={successAlertOpen}
            successMessage={successMessage}
            errorAlertOpen={errorAlertOpen}
            errorMessage={errorMessage}
          />
          <DialogTitle>Connect a new device</DialogTitle>
          {createPresignedUrl.isLoading ? (
            "Loading..."
          ) : deviceLink === "" ? (
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleCreateLink();
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
                <FormControl>
                  <FormLabel>Mode</FormLabel>
                  <Checkbox label="Offline" color="primary" />
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
              {deviceLink.length > 15
                ? `${deviceLink.substring(0, 100)}...`
                : deviceLink}
            </p>
          )}
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Devices;
