import React, { useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ModalClose,
} from "@mui/joy";
import Menu from "@mui/icons-material/Menu";

import { Tool } from "./types";
import { Link } from "react-router-dom";

interface SidebarProps {
  tools: Tool[];
  isDesktop: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ tools, isDesktop }) => {
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sidebarContent = (
    <Box
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => isDesktop && setIsHovered(false)}
      sx={{
        width: isDesktop ? (isHovered ? "400px" : "60px") : "100%",
        height: "100%",
        position: "fixed",
        zIndex: 1000,
        backgroundColor: "#677882",
        color: "white",
      }}
    >
      {!isDesktop && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ml: "auto",
            mt: 1,
            mr: 1,
          }}
        >
          <ModalClose
            id="close-icon"
            sx={{ position: "initial" }}
            onClick={() => setOpen(false)}
          />
        </Box>
      )}
      <List
        size="lg"
        component="nav"
        sx={{
          flex: "none",
          mt: 6,
          mb: 5,
          fontSize: "xl",
          "& > a": {
            display: "flex",
            textDecoration: "none",
            width: "100%",
          },
        }}
      >
        {tools.map((tool) => (
          <Link to={"/dashboard/" + tool.path}>
            <ListItemButton
              key={tool.name}
              onClick={() => setOpen(false)}
              sx={{
                fontWeight: "lg",
                justifyContent: "center",
                width: "100%",
                color: "white",
              }}
            >
              {isHovered || !isDesktop ? tool.name : tool.icon}
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      {!isDesktop &&
        !open && ( // Add the !open condition here
          <Box sx={{ position: "relative" }}>
            <IconButton
              variant="outlined"
              sx={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 1100,
              }}
              color="neutral"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </IconButton>
          </Box>
        )}
      {isDesktop ? (
        sidebarContent
      ) : (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          hideBackdrop={true}
          size="sm"
          sx={{
            "--Drawer-horizontalSize": "100%",
            position: "relative",
            zIndex: 1000,
            width: "100%",
          }}
        >
          {sidebarContent}
        </Drawer>
      )}
    </React.Fragment>
  );
};

export default Sidebar;
