"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
class Admin {
    constructor(id = "", name, email, password, salt) {
        this.profile = "";
        this._modifiedFields = {};
        this.id = id;
        this.userName = name;
        this.email = email;
        this.password = password;
        this.salt = salt;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setUserName(name) {
        this.userName = name;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.userName = true;
        this._modifiedFields.updatedAt = true;
    }
    setPassword(password, salt) {
        this.password = password;
        this.salt = salt;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.password = true;
        this._modifiedFields.salt = true;
        this._modifiedFields.updatedAt = true;
    }
    setProfile(profile) {
        this.profile = profile;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.profile = true;
        this._modifiedFields.updatedAt = true;
    }
    setRefreshToken(refresh_token) {
        this.refresh_token = refresh_token;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.refresh_token = true;
    }
    sanitizeAdmin() {
        const admin = {};
        admin.userName = this.userName;
        admin.profile = this.profile;
        admin.id = this.id;
        admin.email = this.email;
        admin.createdAt = this.createdAt;
        admin.updatedAt = this.updatedAt;
        return admin;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Admin = Admin;
