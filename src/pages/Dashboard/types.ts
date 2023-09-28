import { SvgIconProps } from "@mui/material";

export type Tool = {
  name: string; // Title of nav element
  icon: React.ReactElement<SvgIconProps>; //icon attached to nav element
  path: string; //route of url for tool
  component: any; //react component to render when routed
  accessLevel: ACCESS_LEVELS[];
  children?: boolean; //true if nested routed is needed in tool
};

export enum ACCESS_LEVELS {
  ALL = "*",
  MEMBER = "member",
  ADMIN = "admin",
  SPONSOR = "sponsor",
}

export type Sensor = {
  sensorName: string;
  data: any[];
  range: [number, number];
};
