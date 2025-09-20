"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./infrastructure/config");
const server_1 = require("./infrastructure/server");
const environment_1 = require("./infrastructure/config/environment");
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, config_1.bootstrap)();
        const server = (0, server_1.createServer)();
        const port = environment_1.env.PORT || 3000;
        console.log(environment_1.env.stripe_publish_key);
        console.log(environment_1.env.stripe_secret_key);
        server.listen(port, () => console.log("server is running", port));
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
start();
