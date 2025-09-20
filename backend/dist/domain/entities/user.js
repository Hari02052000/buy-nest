"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id = "", name, email, isGoogleProvide = false, profile, password, salt, googleId) {
        this.isEmailVerified = false;
        this.profile = "";
        this._modifiedFields = {};
        this.id = id;
        this.userName = name;
        this.email = email;
        if (password)
            this.password = password;
        if (salt)
            this.salt = salt;
        if (profile)
            this.profile = profile;
        if (googleId)
            this.googleId = googleId;
        this.isGoogleProvided = isGoogleProvide;
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
        this.modifiedFields.profile = true;
        this._modifiedFields.updatedAt = true;
    }
    setGoogleId(googleId) {
        this.googleId = googleId;
        this.isGoogleProvided = true;
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.googleId = true;
        this.modifiedFields.isGoogleProvided = true;
        this._modifiedFields.updatedAt = true;
    }
    setOtp(otp) {
        this.otp = otp;
        this.otpExp = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.otp = true;
        this._modifiedFields.otpExp = true;
        this._modifiedFields.updatedAt = true;
    }
    setRefreshToken(refresh_token) {
        this.refresh_token = refresh_token;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.refresh_token = true;
    }
    setEmailVerified(isVerified) {
        this.isEmailVerified = isVerified;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.isEmailVerified = true;
        this.modifiedFields.updatedAt = true;
    }
    sanitizeUser() {
        const user = {};
        user.userName = this.userName;
        user.profile = this.profile;
        user.id = this.id;
        user.isEmailVerified = this.isEmailVerified;
        user.createdAt = this.createdAt;
        user.updatedAt = this.updatedAt;
        return user;
    }
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.User = User;
