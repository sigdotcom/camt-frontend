import axios from "axios";
import { Auth } from "aws-amplify";
import { useQuery, useMutation } from "react-query";

// const resumeUrl: string = "http://127.0.0.1:4000/resumes";
const fetchResumes = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + "/resumes/list",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return data;
};

export const useListResumes = (options = {}) => {
  return useQuery("resumes", fetchResumes, options);
};

const insertResume = async (file: string) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  // const formData = new FormData();
  // formData.append('resume', file);

  // Adjust URL and config as needed
  const response = await axios.post(
    process.env.REACT_APP_API_URL + "/resumes/insert",
    file,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};

export const useInsertResume = () => {
  return useMutation(insertResume);
};
