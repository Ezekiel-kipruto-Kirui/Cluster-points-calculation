import app from "../index";

export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}
