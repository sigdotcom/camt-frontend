import { Auth } from "aws-amplify";
import React from "react";
import { useNavigate } from "react-router";

const AuthLogout: React.FC = () => {
  let navigate = useNavigate();
  const logout = async () => {
    try {
      await Auth.signOut();
      return navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  logout();
  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default AuthLogout;
