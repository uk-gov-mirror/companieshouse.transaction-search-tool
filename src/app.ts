import express from "express";
import { createLogger, createLoggerMiddleware } from "ch-structured-logging";
import * as nunjucks from "nunjucks";
import config from "./config";
import path from "path";

import BarcodeSearchRouter from "./routes/BarcodeSearchRouter";
import authenticationMiddleware from "./controllers/Authentication";
import SigninRouter from "./routes/SigninRouter";
import cookieParser from "cookie-parser";
import getSessionMiddleware from "./utils/SessionHelper";
import helmet from "helmet";

const app = express();
const logger = createLogger(config.applicationNamespace);

const viewPath = path.join(__dirname, "views");

var env = nunjucks
    .configure([
        viewPath,  
        "node_modules/govuk-frontend/",
        "node_modules/govuk-frontend/components",
    ], {
        autoescape: true,
        noCache: false,
        express: app
    });

app.set("views", viewPath);
app.set("view engine", "html");
env.addGlobal("CDN_URL", config.cdnUrl);

app.use(cookieParser());
app.use(getSessionMiddleware());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use(`/${config.urlPrefix}`, SigninRouter.create());

app.use(authenticationMiddleware());
app.use(`/${config.urlPrefix}`, BarcodeSearchRouter.create());
app.use(createLoggerMiddleware(config.applicationNamespace));

app.listen(config.port, function () {
    logger.info(`Server started on port ${config.port}`);
});