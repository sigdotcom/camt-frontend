import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

interface TableProps {
  data: any[];
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const Table: React.FC<TableProps> = ({ data }) => {
  if (!data.length) return null;

  // Generate columns from data keys
  const columns: GridColDef[] = Object.keys(data[0]).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1),
    editable: false,
    minWidth: 100,
    // Only use flex when necessary, not with a width
    // When using flex, you can control the relative size of this column compared to others
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
        // Ensure the DataGrid takes the full width of its container
        sx={{
          width: "80vw",
        }}
      />
    </Box>
  );
};

export default Table;
