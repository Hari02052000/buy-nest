import { Document } from "mongoose";

export interface AdminProps {
  id: string;
  userName: string;
  email: string;
  password: string | undefined;
  profile: string;
  salt: string | undefined;
  refresh_token: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminInput {
  email: string;
  password: string;
  salt: string;
  userName?: string;
  profile?: string;
}

export type SanitizedAdmin = Omit<AdminProps, "password" | "salt" | "refresh_token">;

export class Admin {
  constructor(private props: AdminProps) {
    Object.assign(this, props);
  }

  static create(data: CreateAdminInput): Admin {
    return new Admin({
      id: "",
      userName: data.userName || data.email.split("@")[0],
      email: data.email,
      password: data.password,
      salt: data.salt,
      profile: data.profile ?? "",
      refresh_token: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: AdminDocument): Admin {
    return new Admin({
      id: (doc._id as any).toString(),
      userName: doc.userName,
      email: doc.email,
      password: doc.password,
      profile: doc.profile || "",
      salt: doc.salt,
      refresh_token: doc.refresh_token || "",
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
  get refresh_token(): string { return this.props.refresh_token; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  sanitize(): SanitizedAdmin {
    const { password, salt, refresh_token, ...safe } = this.props;
    return safe;
  }

  toObject(): AdminProps {
    return { ...this.props };
  }
}

export interface AdminDocument extends Document {
  userName: string;
  email: string;
  password?: string;
  profile?: string;
  salt?: string;
  refresh_token?: string;
  createdAt: Date;
  updatedAt: Date;
}
