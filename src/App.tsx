import React from "react";
import { RouterProvider } from "react-router-dom";
import { Amplify } from "aws-amplify";
import pages from "./pages/pages";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

function App() {
  return (
    <RouterProvider router={pages} fallbackElement={<p>Initial Load...</p>} />
  );
}

export default App;
