import { defineMock } from "vite-plugin-mock-dev-server";
import { resultSuccess, resultError } from "./utils";
import frontEndRoutes from "@/router/frontEnd";

export default defineMock([
  {
    url: "/mock/backendRoute",
    delay: [200, 500],
    method: ["GET"],
    body: ({ headers }) => {
      const { authorization } = headers;
      if (authorization === "Bearer 123456abc") {
        return resultSuccess(frontEndRoutes, "success");
      } else {
        return resultError([], "no permission");
      }
    },
  },
]);
