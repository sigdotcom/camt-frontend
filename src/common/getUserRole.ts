import { Auth } from "aws-amplify";

const checkUserAuthentication = async () => {
  let role = "";
  try {
    await Auth.currentSession().then((data) => {
      let idToken = data.getIdToken();
      let attributes = idToken.payload;
      role = attributes["custom:role"];
    });
  } catch (error) {
    console.log(error);
    return null;
  }
  return role;
};
export default checkUserAuthentication;
