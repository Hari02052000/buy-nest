import { Document } from "mongoose";

export interface UserProps {
  id: string;
  userName: string;
  email: string;
  isEmailVerified: boolean;
  password: string | undefined;
  profile: string;
  salt: string | undefined;
  refresh_token: string;
  isGoogleProvided: boolean;
  googleId: string;
  otp: number;
  otpExp: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  salt: string;
  userName?: string;
  isGoogleProvided?: boolean;
  googleId?: string;
  profile?: string;
}

export type SanitizedUser = Omit<UserProps, "password" | "salt" | "refresh_token" | "googleId" | "otp" | "otpExp">;

export class User {
  constructor(private props: UserProps) {
    Object.assign(this, props);
  }

  static create(data: CreateUserInput): User {
    return new User({
      id: "",
      userName: data.userName || data.email.split("@")[0],
      email: data.email,
      password: data.password,
      salt: data.salt,
      isEmailVerified: false,
      profile: data.profile ?? "",
      refresh_token: "",
      isGoogleProvided: data.isGoogleProvided ?? false,
      googleId: data.googleId ?? "",
      otp: 0,
      otpExp: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: UserDocument): User {
    return new User({
      id: (doc._id as any).toString(),
      userName: doc.userName,
      email: doc.email,
      isEmailVerified: doc.isEmailVerified,
      password: doc.password,
      profile: doc.profile || "",
      salt: doc.salt,
      refresh_token: doc.refresh_token || "",
      isGoogleProvided: doc.isGoogleProvided,
      googleId: doc.googleId || "",
      otp: doc.otp || 0,
      otpExp: doc.otpExp || "",
      createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get userName(): string { return this.props.userName; }
  get email(): string { return this.props.email; }
  get password(): string | undefined { return this.props.password; }
  get salt(): string | undefined { return this.props.salt; }
  get profile(): string { return this.props.profile; }
  get isEmailVerified(): boolean { return this.props.isEmailVerified; }
  get isGoogleProvided(): boolean { return this.props.isGoogleProvided; }
  get googleId(): string { return this.props.googleId; }
  get refresh_token(): string { return this.props.refresh_token; }
  get otp(): number { return this.props.otp; }
  get otpExp(): string { return this.props.otpExp; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  sanitize(): SanitizedUser {
    const { password, salt, refresh_token, googleId, otp, otpExp, ...safe } = this.props;
    return safe;
  }

  toObject(): UserProps {
    return { ...this.props };
  }
}

export interface UserDocument extends Document {
  userName: string;
  email: string;
  isEmailVerified: boolean;
  password?: string;
  profile?: string;
  salt?: string;
  refresh_token?: string;
  isGoogleProvided: boolean;
  googleId?: string;
  otp?: number;
  otpExp?: string;
  createdAt: Date;
  updatedAt: Date;
}
