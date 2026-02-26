import { ThorClient } from "@vechain/sdk-network";
import { createApp } from "./app.js";

const thor = ThorClient.at("https://mainnet.vechain.org");
const app = createApp(thor);

app.listen(4010, () => console.log("thor-sdk service on http://localhost:4010"));
