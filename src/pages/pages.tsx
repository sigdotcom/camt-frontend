import { Home } from "./LandingPage";
import { Signout } from "./Auth";
import { Dashboard } from "./Dashboard";
import { createBrowserRouter, redirect } from "react-router-dom";
import { checkUserAuthentication } from "../common";
import { getToolRoutes } from "./Dashboard/tools/tools";

async function protectedLoader(): Promise<Response | null> {
  const isAuthenticated = await checkUserAuthentication();

  if (!isAuthenticated) {
    return redirect("/");
  }
  return null;
}

const pages = createBrowserRouter([
  {
    id: "root",
    path: "/",
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "auth/logout",
        Component: Signout,
      },
      {
        path: "dashboard",
        loader: protectedLoader,
        Component: Dashboard,
        children: getToolRoutes(),
      },
    ],
  },
]);

export default pages;
