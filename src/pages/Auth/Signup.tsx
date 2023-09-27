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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import { useNavigate } from "react-router";
import { FormHelperText } from "@mui/joy";
import PasswordValidation from "./PasswordValidation";

function Signup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmationError, setConfirmationError] = useState<string | null>(
    null
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  let navigate = useNavigate();

  useEffect(() => {
    setGivenName("");
    setFamilyName("");
    setEmail("");
    setPassword("");
    setConfirmationCode("");
    setIsConfirming(false);
    setPasswordError(null);
  }, [isVisible]);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          given_name: givenName,
          family_name: familyName,
        },
      });
      setIsConfirming(true);
    } catch (error) {
      const err = error as any;
      const errorMessage: string = err.message.split(": ")[1];
      setPasswordError(errorMessage);
    }
  };

  const handleConfirmation = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      await Auth.confirmSignUp(email, confirmationCode);

      const user = await Auth.signIn(email, password);

      if (user) {
        setIsVisible(false);

        return navigate("/dashboard");
      }
    } catch (error) {
      setConfirmationError("Invalid confirmation code. Please try again.");
    }
  };
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        sx={{ width: "200px" }}
        startDecorator={<PersonAddIcon />}
        onClick={() => setIsVisible(true)}
      >
        Sign Up
      </Button>
      <Modal open={isVisible} onClose={() => setIsVisible(false)}>
        <ModalDialog>
          <DialogTitle>Create a New Account</DialogTitle>
          <DialogContent>
            Fill in the required information to sign up.
          </DialogContent>

          {isConfirming ? (
            <form onSubmit={handleConfirmation}>
              <Stack spacing={2}>
                <FormControl error={Boolean(confirmationError)}>
                  <FormLabel>Confirmation Code</FormLabel>
                  <Input
                    autoFocus
                    required
                    value={confirmationCode}
                    onChange={(e) => {
                      setConfirmationCode(e.target.value);
                      setConfirmationError(null); // Reset the error when user types
                    }}
                    error={Boolean(confirmationError)}
                  />
                  {confirmationError && (
                    <FormHelperText>
                      <InfoOutlined />
                      {confirmationError}
                    </FormHelperText>
                  )}
                </FormControl>
                <Button sx={{ backgroundColor: "#3ba2dd" }} type="submit">
                  Confirm
                </Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    autoFocus
                    required
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl error={Boolean(passwordError)}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(null); // Clear error when user starts typing
                    }}
                    sx={{ marginBottom: "10px" }}
                    error={Boolean(passwordError)}
                  />
                  {passwordError && (
                    <FormHelperText>
                      <InfoOutlined />
                      {passwordError}
                    </FormHelperText>
                  )}
                  {password !== "" ? (
                    <PasswordValidation password={password} />
                  ) : (
                    <></>
                  )}
                </FormControl>
                <Button sx={{ backgroundColor: "#3ba2dd" }} type="submit">
                  Signup
                </Button>
              </Stack>
            </form>
          )}
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

export default Signup;
