import { userProperties } from "./user";

export class Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  user: string | Partial<userProperties>;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  constructor(
    id: string = "",
    fullName: string,
    addressLine1: string,
    userId: string | Partial<userProperties>,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    phone: string,
    addressLine2?: string,
  ) {
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
    if (addressLine2) this.addressLine2 = addressLine2;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  setFullName(name: string) {
    this.fullName = name;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.fullName = true;
    this._modifiedFields.updatedAt = true;
  }
  setAddressLine1(addressLine1: string) {
    this.addressLine1 = addressLine1;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.addressLine1 = true;
    this._modifiedFields.updatedAt = true;
  }
  setAddressLine2(addressLine2: string) {
    this.addressLine2 = addressLine2;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.addressLine2 = true;
    this._modifiedFields.updatedAt = true;
  }
  setCity(city: string) {
    this.city = city;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.city = true;
    this._modifiedFields.updatedAt = true;
  }
  setState(state: string) {
    this.state = state;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.state = true;
    this._modifiedFields.updatedAt = true;
  }
  setZipCode(zipCode: string) {
    this.zipCode = zipCode;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.zipCode = true;
  }
  setCountry(contry: string) {
    this.country = contry;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.country = true;
    this._modifiedFields.updatedAt = true;
  }
  setPhone(phone: string) {
    this.phone = phone;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.phone = true;
    this._modifiedFields.updatedAt = true;
  }
  sanitizeAddress() {
    const address = {} as Partial<addressProperties>;
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
      address.user = {} as Partial<userProperties>;
      address.user.id = this.user.id;
      address.user.email = this.user.email;
    } else {
      address.user = this.user;
    }
    return address;
  }
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type addressProperties = Omit<
  Address,
  | "setFullName"
  | "setAddressLine1"
  | "setAddressLine2"
  | "setCity"
  | "setZipCode"
  | "setCountry"
  | "setState"
  | "setPhone"
  | "sanitizeAddress"
  | "clearModifiedFields"
  | "modifiedFields"
>;
type modifiedFields = {
  [K in keyof Omit<addressProperties, "id">]: boolean;
};
