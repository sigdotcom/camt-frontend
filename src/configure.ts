import {
  SSMClient,
  GetParameterCommand,
  SSMClientConfig,
} from "@aws-sdk/client-ssm";
import { fromSSO } from "@aws-sdk/credential-provider-sso";
import * as fs from "fs";

const REGION = "us-east-1";
const PROFILE = "research";

const env = process.env.DEPLOYING_ENV_VAR || null;

// Initializing the SSM client with specific profile and region
const ssmClientConfig: SSMClientConfig = {
  region: REGION,
};

if (!env) {
  ssmClientConfig.credentials = fromSSO({ profile: PROFILE });
  console.log("RUNNING IN LOCAL CONFIG");
}

const ssmClient = new SSMClient(ssmClientConfig);
async function fetchParameters() {
  let apiUrl: string =
    "https://nnikhk3cq3.execute-api.us-east-1.amazonaws.com/Prod";

  try {
    const userPoolId = new GetParameterCommand({
      Name: "userPoolId",
      WithDecryption: true,
    });
    const userPoolWebClientId = new GetParameterCommand({
      Name: "userPoolWebClientId",
      WithDecryption: true,
    });

    const userPoolIdResponse = await ssmClient.send(userPoolId);
    const userPoolWebClientIdResponse = await ssmClient.send(
      userPoolWebClientId
    );

    const envContent = `
        REACT_APP_USER_POOL_ID=${userPoolIdResponse.Parameter?.Value}
        REACT_APP_USER_POOL_CLIENT_ID=${userPoolWebClientIdResponse.Parameter?.Value}
        REACT_APP_API_URL=${apiUrl}
      `;

    const formattedEnv = envContent
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim();
    fs.writeFileSync(".env", formattedEnv);
  } catch (error) {
    console.error("Error fetching parameters:", error);
  }
}

fetchParameters();
