import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'fed39d5d240338d6f6df6b749504a654ace4bd2b', queries,  });
export default client;
  