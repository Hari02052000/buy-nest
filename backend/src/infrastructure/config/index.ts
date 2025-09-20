import connectDb from "../db/connection";
import { createAdmin } from "./admin.seed";

export const bootstrap = async () => {
  await connectDb();
  await createAdmin();
};
