import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../../common";
import { Signin, Signup } from "../Auth";
import { Button } from "@mui/joy";

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticated(await checkUserAuthentication());
    };
    checkAuth();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f4f5f8",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: "2em",
          marginBottom: "20px",
          color: "#555555",
          fontWeight: "bold",
        }}
      >
        CAMT Dashboard
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              {" "}
              <Button
                variant="outlined"
                color="neutral"
                sx={{ width: "200px" }}
              >
                Go to dashboard
              </Button>
            </Link>
            <Link
              to="/auth/logout"
              style={{ display: "block", marginTop: "10px" }}
            >
              <Button
                variant="outlined"
                color="neutral"
                sx={{ width: "200px" }}
              >
                Logout
              </Button>
            </Link>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Signin />
            <div style={{ marginTop: "10px" }}></div>
            <Signup />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
