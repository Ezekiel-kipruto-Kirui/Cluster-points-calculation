import { createBackendServer } from "../index";

const app = createBackendServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default app;
