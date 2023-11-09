import React, { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import {
  useCreateAccount,
  useDeleteAccount,
  useListUsers,
  useUpdatePermission,
} from "../../../api/users";
import {
  FormControl,
  Input,
  Select,
  Option,
  IconButton,
  Button,
  Stack,
  selectClasses,
} from "@mui/joy";

import RefreshIcon from "@mui/icons-material/Refresh";
import { ACCESS_LEVELS } from "../types";
import { KeyboardArrowDown } from "@mui/icons-material";
import Alert from "../../../components/Alert";

const Permissions = () => {
  const {
    data: rawData,
    isLoading: listUserLoading,
    refetch,
  } = useListUsers({
    refetchInterval: 500, // Refetch every second when the window is in focus
    refetchOnWindowFocus: true, // Refetch when the window is refocused
    refetchIntervalInBackground: false, // Don't refetch when the window is not in focus
  });
  const updatePermission = useUpdatePermission();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  const data = Array.isArray(rawData) ? rawData : [];
  const [searchTerm, setSearchTerm] = useState("");
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      valueGetter: (params: GridCellParams) =>
        `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: "userId", headerName: "User ID", width: 250 },
    {
      field: "role",
      headerName: "Current Role",
      width: 150,
      editable: false,
      renderCell: (params: GridCellParams) => (
        <Select
          sx={{
            width: 150,
            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
          indicator={<KeyboardArrowDown />}
          defaultValue={params.value as string}
          onChange={(event, value) =>
            handleRoleChange(params.id, value, params.row.awsAccountStatus)
          }
        >
          <Option value={ACCESS_LEVELS.MEMBER}>Member</Option>
          <Option value={ACCESS_LEVELS.RESEARCHER}>Researcher</Option>
          <Option value={ACCESS_LEVELS.ADMIN}>Admin</Option>
        </Select>
      ),
    },
    {
      field: "awsAccountStatus",
      headerName: "AWS Access",
      width: 150,
      editable: false,
      renderCell: (params: GridCellParams) =>
        params.row.awsAccountStatus !== "pending" ? (
          params.row.awsAccountStatus !== "false" ? (
            <Button
              onClick={() =>
                handleRevokeAccount(
                  params.row.userId,
                  params.row.awsAccountStatus
                )
              }
              size="md"
              variant="solid"
              color="danger"
            >
              Revoke
            </Button>
          ) : (
            <p>{params.row.awsAccountStatus}</p>
          )
        ) : (
          <Button
            onClick={() =>
              handleApproveAccount(
                params.row.userId,
                params.row.role,
                params.row.email,
                params.row.firstName,
                params.row.lastName
              )
            }
            size="md"
            variant="solid"
            color="success"
          >
            Approve
          </Button>
        ),
    },
  ];

  const handleRoleChange = async (
    id: any,
    newValue: string | null,
    identityId: string
  ) => {
    if (newValue && process.env.REACT_APP_USER_POOL_ID) {
      try {
        await updatePermission.mutateAsync({
          userId: id,
          userRole: newValue,
          userPoolId: process.env.REACT_APP_USER_POOL_ID,
          identityId: identityId,
        });

        // Trigger the Alert on success
        setSuccessAlertOpen(true);
        setSuccessMessage("Permission updated successfully!");

        // hide after 3 seconds
        setTimeout(() => setSuccessAlertOpen(false), 3000);
      } catch (error) {
        setErrorAlertOpen(true);
        setErrorMessage(
          "Error updating permission: " + (error as Error).message
        );

        setTimeout(() => setErrorAlertOpen(false), 5000);
      }
    }
  };

  const handleApproveAccount = async (
    userId: string,
    role: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      await createAccount.mutateAsync({
        userId: userId,
        role: role,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      // Trigger the Alert on success
      setSuccessAlertOpen(true);
      setSuccessMessage("Account approved");
      // hide after 3 seconds
      setTimeout(() => setSuccessAlertOpen(false), 3000);
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage("Error approving account: " + (error as Error).message);

      setTimeout(() => setErrorAlertOpen(false), 5000);
    }
  };

  const handleRevokeAccount = async (
    userId: string,
    awsAccountStatus: string
  ) => {
    try {
      await deleteAccount.mutateAsync({
        userId: userId,
        identityId: awsAccountStatus,
      });

      // Trigger the Alert on success
      setSuccessAlertOpen(true);
      setSuccessMessage("Account access revoked");
      // hide after 3 seconds
      setTimeout(() => setSuccessAlertOpen(false), 3000);
    } catch (error) {
      setErrorAlertOpen(true);
      setErrorMessage("Error revoking access: " + (error as Error).message);

      setTimeout(() => setErrorAlertOpen(false), 5000);
    }
  };

  const filteredData = listUserLoading
    ? []
    : data.filter(
        (row: {
          firstName: string;
          lastName: string;
          userId: string;
          role: string;
          awsAccountStatus: string;
        }) =>
          row.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.awsAccountStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Box sx={{ width: "100%" }}>
      <Alert
        successAlertOpen={successAlertOpen}
        successMessage={successMessage}
        errorAlertOpen={errorAlertOpen}
        errorMessage={errorMessage}
      />

      <div>
        <FormControl
          style={{ marginBottom: 20, marginRight: 10, width: "300px" }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {" "}
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
            />
            <IconButton onClick={() => refetch()} aria-label="refresh">
              <RefreshIcon />
            </IconButton>
          </Stack>
        </FormControl>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          getRowId={(row) => row.userId}
          loading={listUserLoading}
          autoHeight={true}
        />
      </div>
    </Box>
  );
};

export default Permissions;
