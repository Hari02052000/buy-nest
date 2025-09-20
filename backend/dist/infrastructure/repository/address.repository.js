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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRepository = void 0;
const entities_1 = require("../../domain/entities");
const address_model_1 = __importDefault(require("../model/address.model"));
class AddressRepository {
    saveAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressDb = new address_model_1.default({
                    fullName: address.fullName,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    user: address.user,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                    country: address.country,
                    phone: address.phone,
                });
                yield addressDb.save();
                return this.mapToAddress(addressDb);
            }
            catch (error) {
                throw new entities_1.APIError(`Failed to save address: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        });
    }
    getAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield address_model_1.default.find({ user: userId });
                return address.map((addr) => this.mapToAddress(addr));
            }
            catch (error) {
                throw new entities_1.APIError();
            }
        });
    }
    editAddress(Product) {
        throw new Error("Method not implemented.");
    }
    mapToAddress(addresstDb) {
        let userValue;
        if (typeof addresstDb.user === "object" && addresstDb.user !== null && "userName" in addresstDb.user) {
            userValue = {};
            userValue.id = addresstDb.user.id;
            userValue.email = addresstDb.user.email;
        }
        else {
            userValue = addresstDb.user.toString();
        }
        const address = new entities_1.Address(addresstDb.id, addresstDb.fullName, addresstDb.addressLine1, userValue, addresstDb.city, addresstDb.state, addresstDb.zipCode, addresstDb.country, addresstDb.phone, addresstDb.addressLine2);
        address.createdAt = addresstDb.createdAt;
        address.updatedAt = addresstDb.updatedAt;
        return address;
    }
    getPopulatedAddress(userId) {
        throw new Error("Method not implemented.");
    }
}
exports.AddressRepository = AddressRepository;
