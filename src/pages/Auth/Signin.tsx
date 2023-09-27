import * as React from "react";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";

function Signin() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  let navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [isVisible]);
  const handleSignin = async () => {
    try {
      const user = await Auth.signIn(email, password);
      if (user) {
        setIsVisible(false);

        return navigate("/dashboard");
      }
    } catch (error) {
      setSignInError("Invalid email or password. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{ width: "200px" }}
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setIsVisible(true)}
      >
        Sign In
      </Button>

      <Modal open={isVisible} onClose={() => setIsVisible(false)}>
        <ModalDialog>
          <DialogTitle>Sign In</DialogTitle>
          <DialogContent>
            Enter your email and password to sign in.
          </DialogContent>
          <Stack spacing={2}>
            <FormControl error={Boolean(signInError)}>
              <FormLabel>Email</FormLabel>
              <Input
                autoFocus
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSignInError(null); // Reset the error when user types
                }}
                error={Boolean(signInError)}
              />
            </FormControl>
            <FormControl error={Boolean(signInError)}>
              <FormLabel>Password</FormLabel>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSignInError(null); // Reset the error when user types
                }}
                error={Boolean(signInError)}
              />
            </FormControl>
            <DialogContent>
              {signInError && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {signInError}
                </div>
              )}
            </DialogContent>
            <Button sx={{ backgroundColor: "#3ba2dd" }} onClick={handleSignin}>
              Sign In
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default Signin;
