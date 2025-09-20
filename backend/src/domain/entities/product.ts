import { categoryProperties } from "./category";
export class Product {
  id: string;
  name: string;
  images: { url: string; id: string }[];
  description: string;
  price: number;
  category: string | Partial<categoryProperties>;
  brandName: string;
  modelName: string;
  isListed: boolean = true;
  stock: number;
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  constructor(
    id: string = "",
    name: string,
    images: { url: string; id: string }[],
    description: string,
    price: number,
    category: string | Partial<categoryProperties>,
    brand: string,
    model: string,
    stock: number,
  ) {
    this.id = id;
    this.name = name;
    this.images = images;
    this.description = description;
    this.price = price;
    this.category = category;
    this.brandName = brand;
    this.modelName = model;
    this.stock = stock;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  setName(name: string) {
    this.name = name;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.name = true;
    this._modifiedFields.updatedAt = true;
  }
  setImages(images: { url: string; id: string }[]) {
    this.images = images;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.images = true;
    this._modifiedFields.updatedAt = true;
  }
  setDescription(description: string) {
    this.description = description;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.description = true;
    this._modifiedFields.updatedAt = true;
  }
  setPrice(price: number) {
    this.price = price;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.price = true;
    this._modifiedFields.updatedAt = true;
  }
  setCategory(category: string) {
    this.category = category;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.category = true;
    this._modifiedFields.updatedAt = true;
  }
  setBrand(brand: string) {
    this.brandName = brand;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.brandName = true;
  }
  setModel(model: string) {
    this.modelName = model;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.modelName = true;
    this._modifiedFields.updatedAt = true;
  }
  setIsListed(isListed: boolean) {
    this.isListed = isListed;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.isListed = true;
    this._modifiedFields.updatedAt = true;
  }
  setStock(stock: number) {
    this.stock = stock;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.stock = true;
    this._modifiedFields.updatedAt = true;
  }
  sanitizeProduct() {
    const product = {} as Partial<productProperties>;
    product.id = this.id;
    product.images = this.images;
    product.description = this.description;
    product.isListed = this.isListed;
    product.price = this.price;
    product.brandName = this.brandName;
    product.modelName = this.modelName;
    product.stock = this.stock;
    product.name = this.name;
    product.createdAt = this.createdAt;
    product.updatedAt = this.updatedAt;
    if (typeof this.category === "object") {
      product.category = {} as Partial<categoryProperties>;
      product.category.ancestors = this.category.ancestors;
      product.category.id = this.category.id;
      product.category.level = this.category.level;
      product.category.name = this.category.name;
      product.category.parentId = this.category.parentId;
    } else {
      product.category = this.category;
    }
    return product;
  }
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type productProperties = Omit<
  Product,
  | "setStock"
  | "setIsListed"
  | "setModel"
  | "sanitizeUser"
  | "setBrand"
  | "setCategory"
  | "setImage"
  | "setDescription"
  | "setPrice"
  | "modifiedFields"
  | "sanitizeProduct"
  | "clearModifiedFields"
>;
type modifiedFields = {
  [K in keyof Omit<productProperties, "id">]: boolean;
};
