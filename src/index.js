import * as dotenv from "dotenv";
dotenv.config();

import app from "./server.js";

app.listen(3030, () => {
  console.log("Server listening on port 3000");
});
