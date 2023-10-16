import axios from "axios";
import { Auth } from "aws-amplify";
import { useQuery, useMutation } from "react-query";

// Centralized Axios Instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;

  // Assert that headers are defined
  config.headers = config.headers || {};
  config.headers.Authorization = token;

  return config;
});

export const fetchWithAuth =
  (method: "get" | "post", endpoint: string) => async (payload?: any) => {
    // Verifying if payload is an empty object
    if (payload && Object.keys(payload).length === 0) {
      console.log("Payload is an empty object");
      return null; // or handle this case as you see fit
    }
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken;

    const response = await axios({
      method,
      url: `${process.env.REACT_APP_API_URL}${endpoint}`,
      data: payload,
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  };

const isDynamoDbItem = (item: any): item is DynamoDbItem => {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  for (let key in item) {
    const attribute = item[key];

    if (typeof attribute !== "object" || attribute === null) {
      return false;
    }

    // Check if the attribute object has one of the DynamoDB type keys like "S", "N", "BOOL", etc.
    const typeKeys = Object.keys(attribute);
    if (
      !typeKeys.some((typeKey) =>
        ["S", "N", "BOOL", "L", "M"].includes(typeKey)
      )
    ) {
      return false;
    }
  }

  return true;
};

export const createUseQuery = (
  key: string,
  fetchFunction: any,
  options = {}
) => {
  return function useCustomQuery(payload?: any) {
    const queryKey = payload ? [key, payload] : key;

    const queryInfo = useQuery(queryKey, () => fetchFunction(payload), options);

    let transformedData = null;

    if (isDynamoDbItem(queryInfo.data)) {
      console.log("Data is a DynamoDB item, transforming...");
      transformedData = transformDynamoDbItem(queryInfo.data);
    } else {
      console.log("Data is NOT a DynamoDB item.");
      transformedData = queryInfo.data;
    }

    console.log("Transformed data: ", transformedData);

    return {
      ...queryInfo,
      data: transformedData,
    };
  };
};

export const createUseMutation = (mutateFunction: any, options = {}) => {
  return function useCustomMutation() {
    const mutationInfo = useMutation(
      (payload) => mutateFunction(payload),
      options
    );
    return mutationInfo;
  };
};

export interface DynamoDbItem {
  [key: string]: {
    [key: string]: any;
  };
}

export function transformDynamoDbItem(item: DynamoDbItem) {
  let transformedItem: { [key: string]: any } = {};

  for (let key in item) {
    for (let type in item[key]) {
      transformedItem[key] = item[key][type];
    }
  }

  return transformedItem;
}
