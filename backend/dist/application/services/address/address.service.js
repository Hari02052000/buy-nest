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
exports.addressService = void 0;
const entities_1 = require("../../../domain/entities");
class addressService {
    constructor(addressRepo, addressUtils, tokenUtils) {
        this.addressRepo = addressRepo;
        this.addressUtils = addressUtils;
        this.tokenUtils = tokenUtils;
    }
    createAddress(reqBody, userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userToken)
                throw new entities_1.ValidationError();
            const isValidUserToken = this.tokenUtils.isValidUserToken(userToken);
            const isValidReq = this.addressUtils.validateCreateAddressRequest(reqBody);
            if (isValidReq && isValidUserToken) {
                const userId = isValidUserToken.payload.id;
                const address = new entities_1.Address("", isValidReq.fullName, isValidReq.addressLine1, userId, isValidReq.city, isValidReq.state, isValidReq.zipCode, isValidReq.country, isValidReq.phone, isValidReq.addressLine2);
                const addressDb = yield this.addressRepo.saveAddress(address);
                return addressDb;
            }
            throw new entities_1.ValidationError();
        });
    }
    getAddress(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidUserToken = this.tokenUtils.isValidUserToken(userToken);
            if (isValidUserToken) {
                const userId = isValidUserToken.payload.id;
                const address = this.addressRepo.getAddress(userId);
                return address;
            }
            throw new entities_1.APIError();
        });
    }
    editAddress(id, reqBody, userToken) {
        throw new Error("Method not implemented.");
    }
    deleteAddress(id, userToken) {
        throw new Error("Method not implemented.");
    }
}
exports.addressService = addressService;
