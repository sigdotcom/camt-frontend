import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Switch, Typography } from "@mui/joy";

interface TableProps {
  data: any[];
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <Typography
        component="label"
        endDecorator={<Switch sx={{ ml: 1 }} disabled={true} />}
      >
        AI Filter(WiP)
      </Typography>
    </GridToolbarContainer>
  );
};

const Table: React.FC<TableProps> = ({ data }) => {
  if (!data.length) return null;

  const columns: GridColDef[] = Object.keys(data[0]).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1),
    editable: false,
    minWidth: 100,
  }));

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        getRowHeight={() => "auto"}
        rows={data}
        columns={columns}
        slots={{
          toolbar: CustomToolbar,
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        sx={{
          width: "80vw",
        }}
      />
    </Box>
  );
};

export default Table;
