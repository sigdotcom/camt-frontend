import React from "react";
import { ACCESS_LEVELS, Tool } from "../types";
import SensorsIcon from "@mui/icons-material/Sensors";
import getUserRole from "../../../common/getUserRole";
import Sensor from "./Sensor";
import { RouteObject, redirect } from "react-router";

export const tools: Tool[] = [
  {
    name: "Sensor Data",
    icon: React.createElement(SensorsIcon),
    path: "sensor",
    accessLevel: [ACCESS_LEVELS.ALL],
    component: Sensor,
  },
];

export function getToolRoutes() {
  const toolRoutes: RouteObject[] = tools.map((tool) => ({
    path: tool.path,
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
