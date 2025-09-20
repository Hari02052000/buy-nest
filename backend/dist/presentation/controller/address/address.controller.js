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
exports.createAddress = exports.getAddress = void 0;
const utils_1 = require("../../../infrastructure/utils");
const address_repository_1 = require("../../../infrastructure/repository/address.repository");
const address_service_1 = require("../../../application/services/address/address.service");
const addressRepo = new address_repository_1.AddressRepository();
const addressServ = new address_service_1.addressService(addressRepo, utils_1.addressUtils, utils_1.tokenUtils);
const getAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const address = yield addressServ.getAddress(token);
        return res.status(200).json({ address });
    }
    catch (error) {
        next(error);
    }
});
exports.getAddress = getAddress;
const createAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        const address = yield addressServ.createAddress(req.body, token);
        return res.status(200).json({ address });
    }
    catch (error) {
        next(error);
    }
});
exports.createAddress = createAddress;
