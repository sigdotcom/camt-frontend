import { Auth } from "aws-amplify";

const checkUserAuthentication = async () => {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch (error) {
    return false;
  }
};
export default checkUserAuthentication;
