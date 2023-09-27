import React from "react";
import { ACCESS_LEVELS, Tool } from "../types";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import getUserRole from "../../../common/getUserRole";
import Profile from "./Profile";
import Resume from "./Resume";
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
    name: "Resume",
    icon: React.createElement(PictureAsPdfIcon),
    path: "resume",
    accessLevel: [ACCESS_LEVELS.SPONSOR, ACCESS_LEVELS.ADMIN],
    component: Resume,
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
