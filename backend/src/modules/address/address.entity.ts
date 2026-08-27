import { Document } from "mongoose";

export interface AddressProps {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  user: string;
}

export class Address {
  constructor(private props: AddressProps) {
    Object.assign(this, props);
  }

  static create(data: CreateAddressInput): Address {
    return new Address({
      id: "",
      fullName: data.fullName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? "",
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      phone: data.phone,
      user: data.user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: AddressDocument): Address {
    return new Address({
      id: (doc._id as any).toString(),
      fullName: doc.fullName,
      addressLine1: doc.addressLine1,
      addressLine2: doc.addressLine2 || "",
      city: doc.city,
      state: doc.state,
      zipCode: doc.zipCode,
      country: doc.country,
      phone: doc.phone,
      user: typeof doc.user === "object" ? doc.user._id.toString() : doc.user.toString(),
      createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get fullName(): string { return this.props.fullName; }
  get addressLine1(): string { return this.props.addressLine1; }
  get addressLine2(): string { return this.props.addressLine2; }
  get city(): string { return this.props.city; }
  get state(): string { return this.props.state; }
  get zipCode(): string { return this.props.zipCode; }
  get country(): string { return this.props.country; }
  get phone(): string { return this.props.phone; }
  get user(): string { return this.props.user; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  toObject(): AddressProps {
    return { ...this.props };
  }
}

export interface AddressDocument extends Document {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  user: any;
  createdAt: Date;
  updatedAt: Date;
}
