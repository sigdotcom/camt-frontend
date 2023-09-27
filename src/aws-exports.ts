const awsconfig = {
  aws_project_region: "us-east-1",
  Auth: {
    region: "us-east-1",
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    oauth: {
      domain: `${process.env.REACT_APP_AUTH_DOMAIN}.auth.us-east-1.amazoncognito.com`,
      scope: ["openid"],
      redirectSignIn: process.env.REACT_APP_REDIRECT_SIGNIN_URL,
      redirectSignOut: process.env.REACT_APP_REDIRECT_SIGNOUT_URL,
      responseType: "code",
    },
  },
};

export default awsconfig;
