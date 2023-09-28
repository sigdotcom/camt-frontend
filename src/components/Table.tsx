import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface TableProps {
  data: any[];
}

const DynamicTable: React.FC<TableProps> = ({ data }) => {
  // Check if data is empty
  if (!data.length) return null;

  // Generate columns based on the first item in the data array
  const columns: GridColDef[] = Object.keys(data[0]).map((key) => {
    let colDef: GridColDef = {
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1), // Convert to title case
      width: 150,
      editable: true,
    };

    // Check for id field to adjust width
    if (key === "id") {
      colDef.width = 90;
    }

    return colDef;
  });

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DynamicTable;
