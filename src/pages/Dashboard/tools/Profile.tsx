import React, { useEffect, useState } from "react";
import {
  useCurrentUser,
  useGetUser,
  useRequestAccount,
} from "../../../api/users";
import { Button } from "@mui/joy";

import OpenInNew from "@mui/icons-material/OpenInNew";
import Alert from "../../../components/Alert";
import { Link } from "react-router-dom";

const Profile = () => {
  const { data: currentUserData } = useCurrentUser();
  const requestAccount = useRequestAccount();
  const userId = currentUserData?.accessToken?.payload?.username || "";

  const { data: getUserData, isLoading: getUserLoading } = useGetUser(userId, {
    refetchInterval: 500, // Refetch every second when the window is in focus
    refetchOnWindowFocus: true, // Refetch when the window is refocused
    refetchIntervalInBackground: false, // Don't refetch when the window is not in focus
  });

  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [awsAccountStatus, setAwsAccountStatus] = useState<string>("");
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!getUserLoading && getUserData && userId !== "") {
      setRole(getUserData?.role || "");
      setEmail(getUserData?.email || "");
      setAwsAccountStatus(getUserData?.awsAccountStatus || "");
    }
  }, [getUserData, getUserLoading, userId]);

  const handleApproveAccount = async (e: any) => {
    e.preventDefault();

    try {
      await requestAccount.mutateAsync({
        userId: userId,
      });

      // Trigger the Alert on success
      setSuccessAlertOpen(true);
      setSuccessMessage("Successfully requested account");

      // hide after 3 seconds
      setTimeout(() => setSuccessAlertOpen(false), 3000);
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage(
        "Error requesting account access: " + (error as Error).message
      );

      setTimeout(() => setErrorAlertOpen(false), 5000);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Alert
        successAlertOpen={successAlertOpen}
        successMessage={successMessage}
        errorAlertOpen={errorAlertOpen}
        errorMessage={errorMessage}
      />

      {getUserLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Logged in as: {email}</p>
          <p>Access Level: {role}</p>
          {awsAccountStatus === "pending" ? (
            <Button
              loading
              loadingPosition="start"
              sx={{ padding: 0, width: 200, margin: "auto" }}
            >
              Waiting for approval...
            </Button>
          ) : awsAccountStatus !== "false" ? (
            <Button
              component="a"
              color="success"
              target="_blank"
              href="https://mstacm.awsapps.com/start#/"
              startDecorator={<OpenInNew />}
              sx={{ width: 200, margin: "auto" }}
            >
              Open AWS Console
            </Button>
          ) : (
            <Button
              onClick={handleApproveAccount}
              size="md"
              sx={{ width: 200, margin: "auto" }}
              variant="solid"
              color="primary"
            >
              Request AWS Access
            </Button>
          )}

          <Link
            to="/auth/logout"
            style={{ display: "block", marginTop: "10px" }}
          >
            <Button variant="outlined" color="neutral" sx={{ width: "200px" }}>
              Logout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
