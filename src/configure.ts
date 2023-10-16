import {
  SSMClient,
  GetParameterCommand,
  SSMClientConfig,
} from "@aws-sdk/client-ssm";
import { fromSSO } from "@aws-sdk/credential-provider-sso";
import * as fs from "fs";

const REGION = "us-east-1";
const PROFILE = "dev";

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
// Fetch parameters
async function fetchParameters() {
  try {
    const userPoolId = new GetParameterCommand({
      Name: "userPoolIdResearch",
      WithDecryption: true,
    });
    const userPoolWebClientId = new GetParameterCommand({
      Name: "userPoolWebClientIdResearch",
      WithDecryption: true,
    });
    const apiUrl = new GetParameterCommand({
      Name: "apiUrlResearch",
      WithDecryption: true,
    });

    const userPoolIdResponse = await ssmClient.send(userPoolId);
    const userPoolWebClientIdResponse = await ssmClient.send(
      userPoolWebClientId
    );
    const apiUrlResponse = await ssmClient.send(apiUrl);
    const envContent = `
        REACT_APP_USER_POOL_ID=${userPoolIdResponse.Parameter?.Value}
        REACT_APP_USER_POOL_CLIENT_ID=${userPoolWebClientIdResponse.Parameter?.Value}
        REACT_APP_API_URL=${apiUrlResponse.Parameter?.Value}
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
