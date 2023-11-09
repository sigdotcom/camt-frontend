import React from "react";
import { Alert as AlertMui, Box, IconButton } from "@mui/joy";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface AlertProps {
  successAlertOpen: boolean;
  successMessage: string;
  errorMessage: string;
  errorAlertOpen: boolean;
}

const Alert: React.FC<AlertProps> = ({
  successAlertOpen,
  successMessage,
  errorMessage,
  errorAlertOpen,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)", // This will center the box horizontally
        zIndex: 1000,
      }}
    >
      {successAlertOpen && (
        <AlertMui
          variant="soft"
          color="success"
          startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
          endDecorator={
            <IconButton variant="plain" size="sm" color="success">
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          {successMessage}
        </AlertMui>
      )}

      {errorAlertOpen && (
        <AlertMui
          variant="outlined"
          color="danger"
          startDecorator={<AccountCircleRoundedIcon />}
          endDecorator={
            <IconButton variant="plain" size="sm" color="danger">
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          {errorMessage}
        </AlertMui>
      )}
    </Box>
  );
};

export default Alert;
