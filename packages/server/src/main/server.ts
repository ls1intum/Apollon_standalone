import express from "express";
import bodyParser from "body-parser";
import * as routes from "./routes";
import { indexHtml, webappPath } from "./constants";

const port = 3333;

export const app = express();

app.use("/", express.static(webappPath));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// registers routes
routes.register(app);

// if nothing matches return webapp
// must be registered after other routes
app.get("/*", (req, res) => {
  res.sendFile(indexHtml);
});

app.listen(port, () => {
  console.log("Apollon Standalone Server listening at http://localhost:%s", port);
});
