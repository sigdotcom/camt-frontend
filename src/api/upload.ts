import axios from "axios";
import { Auth } from "aws-amplify";
import { useMutation } from "react-query";

const uploadData = async (payload: { file: any }) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;

    // Fetch the pre-signed URL
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `upload/url`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!data) {
      console.log("Failed to get upload URL.");
      return;
    }

    // Upload the file to S3 using the pre-signed URL
    const file = payload.file;
    await axios.put(data, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    console.log("Upload successful!");
  } catch (error) {
    console.log("Upload failed.", error);
  }
};

export const useUploadData = () => {
  return useMutation(uploadData);
};

const createPresignedUrl = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;

    // Fetch the pre-signed URL
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `upload/url`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!data) {
      console.log("Failed to get upload URL.");
      return;
    }

    return data;
  } catch (error) {
    console.log("Upload failed.", error);
  }
};

export const useCreatePresignedUrl = () => {
  return useMutation(createPresignedUrl);
};
