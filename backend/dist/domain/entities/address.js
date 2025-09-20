"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    constructor(id = "", fullName, addressLine1, userId, city, state, zipCode, country, phone, addressLine2) {
        this._modifiedFields = {};
        this.id = id;
        this.fullName = fullName;
        this.addressLine1 = addressLine1;
        this.city = city;
        this.user = userId;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.phone = phone;
        this.phone = phone;
        if (addressLine2)
            this.addressLine2 = addressLine2;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setFullName(name) {
        this.fullName = name;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.fullName = true;
        this._modifiedFields.updatedAt = true;
    }
    setAddressLine1(addressLine1) {
        this.addressLine1 = addressLine1;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.addressLine1 = true;
        this._modifiedFields.updatedAt = true;
    }
    setAddressLine2(addressLine2) {
        this.addressLine2 = addressLine2;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.addressLine2 = true;
        this._modifiedFields.updatedAt = true;
    }
    setCity(city) {
        this.city = city;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.city = true;
        this._modifiedFields.updatedAt = true;
    }
    setState(state) {
        this.state = state;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.state = true;
        this._modifiedFields.updatedAt = true;
    }
    setZipCode(zipCode) {
        this.zipCode = zipCode;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.zipCode = true;
    }
    setCountry(contry) {
        this.country = contry;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.country = true;
        this._modifiedFields.updatedAt = true;
    }
    setPhone(phone) {
        this.phone = phone;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.phone = true;
        this._modifiedFields.updatedAt = true;
    }
    sanitizeAddress() {
        const address = {};
        address.id = this.id;
        address.state = this.state;
        address.addressLine1 = this.addressLine1;
        address.addressLine2 = this.addressLine2;
        address.phone = this.phone;
        address.country = this.country;
        address.fullName = this.fullName;
        address.city = this.city;
        address.createdAt = this.createdAt;
        address.updatedAt = this.updatedAt;
        if (typeof this.user === "object") {
            address.user = {};
            address.user.id = this.user.id;
            address.user.email = this.user.email;
        }
        else {
            address.user = this.user;
        }
        return address;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Address = Address;
