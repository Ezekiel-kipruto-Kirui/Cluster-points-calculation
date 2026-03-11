import { createBackendServer } from "../index";

const app = createBackendServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(request: any, response: any) {
  return app(request, response);
}

