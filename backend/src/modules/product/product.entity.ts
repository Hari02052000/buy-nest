import { Document } from "mongoose";

export interface ProductImage {
  url: string;
  id: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  ancestors: string[];
  isListed: boolean;
}

export type ProductCategoryValue = string | ProductCategory;

export interface ProductProps {
  id: string;
  name: string;
  images: ProductImage[];
  description: string;
  price: number;
  category: ProductCategoryValue;
  brandName: string;
  modelName: string;
  isListed: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  images?: ProductImage[];
  description: string;
  price: number;
  category: string;
  brandName: string;
  modelName: string;
  stock: number;
}

export type SanitizedProduct = Omit<ProductProps, "updatedAt">;

export class Product {
  private props: ProductProps;
  private _modifiedFields: Partial<Record<keyof ProductProps, boolean>> = {};

  constructor(props: ProductProps) {
    this.props = { ...props };
  }

  static create(input: CreateProductInput): Product {
    return new Product({
      id: "",
      name: input.name,
      images: input.images ?? [],
      description: input.description,
      price: input.price,
      category: input.category,
      brandName: input.brandName,
      modelName: input.modelName,
      isListed: true,
      stock: input.stock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromDocument(doc: ProductDocument): Product {
    let categoryValue: ProductCategoryValue;

    if (
      typeof doc.category === "object" &&
      doc.category !== null &&
      "name" in doc.category
    ) {
      const cat = doc.category as unknown as {
        _id?: { toString(): string };
        name: string;
        ancestors: Array<{ toString(): string }>;
        isListed: boolean;
      };
      categoryValue = {
        id: cat._id?.toString() ?? "",
        name: cat.name,
        ancestors: cat.ancestors.map((a) => a.toString()),
        isListed: cat.isListed,
      };
    } else {
      categoryValue = String(doc.category);
    }

    return new Product({
      id: (doc._id as any).toString(),
      name: doc.name,
      images: doc.images,
      description: doc.description,
      price: doc.price,
      category: categoryValue,
      brandName: doc.brandName,
      modelName: doc.modelName,
      isListed: doc.isListed,
      stock: doc.stock,
      createdAt: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString?.() ?? new Date().toISOString(),
    });
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get images(): ProductImage[] { return this.props.images; }
  get description(): string { return this.props.description; }
  get price(): number { return this.props.price; }
  get category(): ProductCategoryValue { return this.props.category; }
  get brandName(): string { return this.props.brandName; }
  get modelName(): string { return this.props.modelName; }
  get isListed(): boolean { return this.props.isListed; }
  get stock(): number { return this.props.stock; }
  get createdAt(): string { return this.props.createdAt; }
  get updatedAt(): string { return this.props.updatedAt; }
  get modifiedFields(): Partial<Record<keyof ProductProps, boolean>> { return { ...this._modifiedFields }; }

  setName(name: string): void {
    this._modifiedFields.name = true;
    this.props.name = name;
  }

  setImages(images: ProductImage[]): void {
    this._modifiedFields.images = true;
    this.props.images = images;
  }

  setDescription(description: string): void {
    this._modifiedFields.description = true;
    this.props.description = description;
  }

  setPrice(price: number): void {
    this._modifiedFields.price = true;
    this.props.price = price;
  }

  setCategory(category: ProductCategoryValue): void {
    this._modifiedFields.category = true;
    this.props.category = category;
  }

  setBrand(brandName: string): void {
    this._modifiedFields.brandName = true;
    this.props.brandName = brandName;
  }

  setModel(modelName: string): void {
    this._modifiedFields.modelName = true;
    this.props.modelName = modelName;
  }

  setIsListed(isListed: boolean): void {
    this._modifiedFields.isListed = true;
    this.props.isListed = isListed;
  }

  setStock(stock: number): void {
    this._modifiedFields.stock = true;
    this.props.stock = stock;
  }

  clearModifiedFields(): void {
    this._modifiedFields = {};
  }

  sanitize(): SanitizedProduct {
    const { updatedAt, ...safe } = this.props;
    return safe;
  }

  toObject(): ProductProps {
    return { ...this.props };
  }
}

export interface ProductDocument extends Document {
  name: string;
  images: ProductImage[];
  description: string;
  price: number;
  category: unknown;
  brandName: string;
  modelName: string;
  isListed: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
