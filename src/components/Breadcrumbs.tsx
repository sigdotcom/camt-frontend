import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // If the path is just '/dashboard' or a similar top-level route, do not render breadcrumbs.
  if (pathnames.length <= 1) {
    return null;
  }

  // Generate breadcrumb links
  const breadcrumbLinks = pathnames.map((value, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
    const isLast = index === pathnames.length - 1;
    const breadcrumbName = value.charAt(0).toUpperCase() + value.slice(1);

    if (isLast) {
      return <Typography key={routeTo}>{breadcrumbName}</Typography>;
    }

    return (
      <Link component={NavLink} to={routeTo} key={routeTo} color="neutral">
        {breadcrumbName}
      </Link>
    );
  });

  return (
    <Breadcrumbs separator={<KeyboardArrowRight />} aria-label="breadcrumbs">
      {breadcrumbLinks}
    </Breadcrumbs>
  );
};
export default DynamicBreadcrumbs;
