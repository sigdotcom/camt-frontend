import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation: React.FC<PasswordValidationProps> = ({
  password,
}) => {
  // eslint-disable-next-line
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>?]+/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasMinLength = password.length >= 8;
  const ValidationItem: React.FC<{ isValid: boolean; label: string }> = ({
    isValid,
    label,
  }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isValid ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
      <span style={{ marginLeft: "8px", color: isValid ? "green" : "red" }}>
        {label}
      </span>
    </div>
  );

  return (
    <div>
      <ValidationItem isValid={hasMinLength} label="Minimum 8 characters" />
      <ValidationItem
        isValid={hasUppercase}
        label="Contains an uppercase letter"
      />
      <ValidationItem isValid={hasDigits} label="Contains a number" />
      <ValidationItem isValid={hasSymbols} label="Contains a symbol" />
    </div>
  );
};

export default PasswordValidation;
