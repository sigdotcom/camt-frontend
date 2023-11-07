import axios from "axios";
import { Auth } from "aws-amplify";
import { useQuery } from "react-query";
import { useCallback } from "react";
import { transformDynamoDbItem } from "./utils";

const fetchSensors = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + "/sensors/list",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const transformedData = data.map(transformDynamoDbItem);

  return transformedData;
};

export const useListSensors = (options = {}) => {
  return useQuery("sensors", fetchSensors, options);
};

const fetchSensor = async (payload: { sensorId: string }) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  const { data } = await axios.get(
    process.env.REACT_APP_API_URL + `sensors/get?userId=${payload.sensorId}`,

    {
      headers: {
        Authorization: token,
      },
    }
  );

  const transformedData = transformDynamoDbItem(data);

  return transformedData;
};

export const useGetSensor = (sensorId: string, options = {}) => {
  // This callback function checks if userId is provided before fetching
  const fetchData = useCallback(async () => {
    if (!sensorId) return null;
    return fetchSensor({ sensorId });
  }, [sensorId]);

  return useQuery(["useGetSensor", sensorId], fetchData, options);
};
