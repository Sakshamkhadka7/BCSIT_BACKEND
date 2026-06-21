import adminSeeder from "./adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/envConfig";

function startServer() {
  const port = envConfig.port || 5000;
  app.listen(port, () => {
     adminSeeder();
    console.log(`Port is listening at ${port}`);
  });
}

startServer();
