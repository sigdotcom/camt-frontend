import { SvgIconProps } from "@mui/material";

export type Tool = {
  name: string;
  icon: React.ReactElement<SvgIconProps>;
  path: string;
  component: any;
  accessLevel: ACCESS_LEVELS[];
};

export enum ACCESS_LEVELS {
  ALL = "*",
  MEMBER = "member",
  ADMIN = "admin",
  SPONSOR = "sponsor",
}
