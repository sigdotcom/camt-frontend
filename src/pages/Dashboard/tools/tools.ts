import React from "react";
import { ACCESS_LEVELS, Tool } from "../types";
import SensorsIcon from "@mui/icons-material/Sensors";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LockIcon from "@mui/icons-material/Lock";
import DevicesIcon from "@mui/icons-material/Devices";
import getUserRole from "../../../common/getUserRole";
import IoT from "./Devices";
import Profile from "./Profile";
import Sensor from "./Sensor";
import Permissions from "./Permissions";
import { RouteObject, redirect } from "react-router";

export const tools: Tool[] = [
  {
    name: "Profile",
    icon: React.createElement(AccountBoxIcon),
    path: "profile",
    accessLevel: [ACCESS_LEVELS.ALL],
    component: Profile,
  },
  {
    name: "Sensors",
    icon: React.createElement(SensorsIcon),
    path: "sensors",
    accessLevel: [ACCESS_LEVELS.ADMIN, ACCESS_LEVELS.RESEARCHER],
    component: Sensor,
    children: true,
  },
  {
    name: "IoT Devices",
    icon: React.createElement(DevicesIcon),
    path: "devices",
    accessLevel: [ACCESS_LEVELS.ADMIN, ACCESS_LEVELS.RESEARCHER],
    component: IoT,
  },
  {
    name: "Permissions",
    icon: React.createElement(LockIcon),
    path: "permissions",
    accessLevel: [ACCESS_LEVELS.ADMIN],
    component: Permissions,
  },
];

export function getToolRoutes() {
  const toolRoutes: RouteObject[] = tools.map((tool) => ({
    path: tool.children ? `${tool.path}/*` : tool.path, // Check for children and append wildcard if true
    Component: tool.component,
    loader: async function authLoader() {
      const role = await getUserRole();
      if (
        tool.accessLevel.includes(ACCESS_LEVELS.ALL) ||
        tool.accessLevel.includes(role as ACCESS_LEVELS)
      ) {
        return null;
      } else {
        return redirect("/dashboard");
      }
    },
  }));

  return toolRoutes;
}
