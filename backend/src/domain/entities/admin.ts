export class Admin {
  id: string;
  userName: string;
  email: string;
  password: string;
  profile: string = "";
  salt: string;
  refresh_token!: string;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  constructor(id: string = "", name: string, email: string, password: string, salt: string) {
    this.id = id;
    this.userName = name;
    this.email = email;
    this.password = password;
    this.salt = salt;
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
    this._modifiedFields.profile = true;
    this._modifiedFields.updatedAt = true;
  }
  setRefreshToken(refresh_token: string) {
    this.refresh_token = refresh_token;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.refresh_token = true;
  }
  sanitizeAdmin() {
    const admin = {} as Partial<adminProperties>;
    admin.userName = this.userName;
    admin.profile = this.profile;
    admin.id = this.id;
    admin.email = this.email;
    admin.createdAt = this.createdAt;
    admin.updatedAt = this.updatedAt;
    return admin;
  }
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type adminProperties = Omit<
  Admin,
  | "setUserName"
  | "setPassword"
  | "sanitizeUser"
  | "setProfile"
  | "setRefreshToken"
  | "modifiedFields"
  | "clearModifiedFields"
  | "sanitizeAdmin"
>;
type modifiedFields = {
  [K in keyof Omit<adminProperties, "id">]: boolean;
};
