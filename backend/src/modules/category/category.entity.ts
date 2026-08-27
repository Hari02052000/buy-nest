import { Document } from "mongoose";

export interface CategoryProps {
  id: string;
  name: string;
  parentId: string | undefined;
  ancestors: string[];
  level: number;
  isListed: boolean;
  image: { url: string; id: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  image: { url: string; id: string };
  parentId?: string;
  ancestors?: string[];
  level?: number;
}

export type SanitizedCategory = Omit<CategoryProps, "updatedAt">;

export class Category {
  constructor(private props: CategoryProps) {
    Object.assign(this, props);
  }

  static create(data: CreateCategoryInput): Category {
    return new Category({
      id: "",
      name: data.name,
      image: data.image,
      parentId: data.parentId,
      ancestors: data.ancestors || [],
      level: data.level || 0,
      isListed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: CategoryDocument): Category {
    return new Category({
      id: (doc._id as any).toString(),
      name: doc.name,
      image: doc.image,
      parentId: doc.parentId?.toString(),
      ancestors: (doc.ancestors || []).map((a) => a.toString()),
      level: doc.level || 0,
      isListed: doc.isListed,
      createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get parentId(): string | undefined { return this.props.parentId; }
  get ancestors(): string[] { return this.props.ancestors; }
  get level(): number { return this.props.level; }
  get isListed(): boolean { return this.props.isListed; }
  get image(): { url: string; id: string } { return this.props.image; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }

  setName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date().toISOString();
  }

  setImage(image: { url: string; id: string }): void {
    this.props.image = image;
    this.props.updatedAt = new Date().toISOString();
  }

  setParentId(parentId: string | undefined): void {
    this.props.parentId = parentId;
    this.props.updatedAt = new Date().toISOString();
  }

  setAncestors(ancestors: string[]): void {
    this.props.ancestors = ancestors;
    this.props.updatedAt = new Date().toISOString();
  }

  setLevel(level: number): void {
    this.props.level = level;
    this.props.updatedAt = new Date().toISOString();
  }

  setIsListed(isListed: boolean): void {
    this.props.isListed = isListed;
    this.props.updatedAt = new Date().toISOString();
  }

  sanitize(): SanitizedCategory {
    const { updatedAt, ...safe } = this.props;
    return safe;
  }

  toObject(): CategoryProps {
    return { ...this.props };
  }
}

export interface CategoryDocument extends Document {
  name: string;
  image: { url: string; id: string };
  parentId: any;
  ancestors: any[];
  level: number;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryTreeItem = SanitizedCategory & { children: SanitizedCategory[] };
