import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'e3805f71f7d392dcc59d76da9b102427ad48a473', queries,  });
export default client;
  