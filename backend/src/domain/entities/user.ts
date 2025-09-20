export class User {
  id: string;
  userName: string;
  email: string;
  isEmailVerified: boolean = false;
  password: string | undefined;
  profile: string = "";
  salt: string | undefined;
  refresh_token!: string;
  isGoogleProvided: boolean;
  googleId!: string;
  otp!: number;
  otpExp!: string;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  constructor(
    id: string = "",
    name: string,
    email: string,
    isGoogleProvide: boolean = false,
    profile?: string,
    password?: string,
    salt?: string,
    googleId?: string,
  ) {
    this.id = id;
    this.userName = name;
    this.email = email;
    if (password) this.password = password;
    if (salt) this.salt = salt;
    if (profile) this.profile = profile;
    if (googleId) this.googleId = googleId;
    this.isGoogleProvided = isGoogleProvide;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  setUserName(name: string) {
    this.userName = name;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.userName = true;
    this._modifiedFields.updatedAt = true;
  }
  setPassword(password: string, salt: string) {
    this.password = password;
    this.salt = salt;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.password = true;
    this._modifiedFields.salt = true;
    this._modifiedFields.updatedAt = true;
  }
  setProfile(profile: string) {
    this.profile = profile;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.profile = true;
    this._modifiedFields.updatedAt = true;
  }
  setGoogleId(googleId: string) {
    this.googleId = googleId;
    this.isGoogleProvided = true;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.googleId = true;
    this.modifiedFields.isGoogleProvided = true;
    this._modifiedFields.updatedAt = true;
  }
  setOtp(otp: number) {
    this.otp = otp;
    this.otpExp = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.otp = true;
    this._modifiedFields.otpExp = true;
    this._modifiedFields.updatedAt = true;
  }
  setRefreshToken(refresh_token: string) {
    this.refresh_token = refresh_token;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.refresh_token = true;
  }
  setEmailVerified(isVerified: boolean) {
    this.isEmailVerified = isVerified;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.isEmailVerified = true;
    this.modifiedFields.updatedAt = true;
  }
  sanitizeUser() {
    const user = {} as Partial<userProperties>;
    user.userName = this.userName;
    user.profile = this.profile;
    user.id = this.id;
    user.isEmailVerified = this.isEmailVerified;
    user.createdAt = this.createdAt;
    user.updatedAt = this.updatedAt;
    return user;
  }
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type userProperties = Omit<
  User,
  | "setUserName"
  | "setPassword"
  | "sanitizeUser"
  | "setEmailVerified"
  | "setProfile"
  | "setOtp"
  | "setRefreshToken"
  | "setGoogleId"
  | "modifiedFields"
  | "clearModifiedFields"
>;
type modifiedFields = {
  [K in keyof Omit<userProperties, "id">]: boolean;
};
