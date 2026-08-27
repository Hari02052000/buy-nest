import { Document } from "mongoose";

export interface WishlistProps {
  id: string;
  userId: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
}

export class Wishlist {
  constructor(private props: WishlistProps) {
    Object.assign(this, props);
  }

  static create(userId: string): Wishlist {
    return new Wishlist({
      id: "",
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: WishlistDocument): Wishlist {
    return new Wishlist({
      id: (doc._id as any).toString(),
      userId: doc.userId,
      items: doc.items || [],
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get items(): string[] { return this.props.items; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  addItem(productId: string): void {
    if (!this.props.items.includes(productId)) {
      this.props.items.push(productId);
      this.props.updatedAt = new Date().toISOString();
    }
  }

  removeItem(productId: string): void {
    this.props.items = this.props.items.filter((id) => id !== productId);
    this.props.updatedAt = new Date().toISOString();
  }

  clearItems(): void {
    this.props.items = [];
    this.props.updatedAt = new Date().toISOString();
  }

  hasItem(productId: string): boolean {
    return this.props.items.includes(productId);
  }

  toObject(): WishlistProps {
    return { ...this.props };
  }
}

export interface WishlistDocument extends Document {
  userId: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}
