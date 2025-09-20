export class Category {
  id: string;
  name: string;
  parentId: string | undefined;
  ancestors: string[] = [];
  level: number = 0;
  isListed: boolean = true;
  image: { url: string; id: string };
  createdAt: string;
  updatedAt: string;
  private _modifiedFields = {} as modifiedFields;
  constructor(
    id: string = "",
    name: string,
    image: { url: string; id: string },
    parentId?: string,
    ancestors?: string[],
    level?: number,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    if (parentId) this.parentId = parentId;
    if (ancestors) this.ancestors = ancestors;
    if (level !== undefined) this.level = level;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  setName(name: string) {
    this.name = name;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.name = true;
    this._modifiedFields.updatedAt = true;
  }
  setImage(image: { url: string; id: string }) {
    this.image = image;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.image = true;
    this._modifiedFields.updatedAt = true;
  }
  setAncestors(ancestors: string[]) {
    this.ancestors = ancestors;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.ancestors = true;
    this._modifiedFields.updatedAt = true;
  }

  setLevel(level: number) {
    this.level = level;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.level = true;
    this._modifiedFields.updatedAt = true;
  }

  setParentId(id: string) {
    this.parentId = id;
    this.updatedAt = new Date().toISOString();
    this.modifiedFields.parentId = true;
    this._modifiedFields.updatedAt = true;
  }
  setIsListed(isListed: boolean) {
    this.isListed = isListed;
    this.updatedAt = new Date().toISOString();
    this._modifiedFields.isListed = true;
    this.modifiedFields.updatedAt = true;
  }
  sanitizeCategory() {
    const category = {} as Partial<categoryProperties>;
    category.name = this.name;
    category.image = this.image;
    category.id = this.id;
    category.isListed = this.isListed;
    category.parentId = this.parentId;
    category.ancestors = this.ancestors;
    category.level = this.level;
    category.createdAt = this.createdAt;
    category.updatedAt = this.updatedAt;
    return category;
  }
  get modifiedFields(): modifiedFields {
    return this._modifiedFields;
  }

  get clearModifiedFields(): modifiedFields {
    this._modifiedFields = {} as modifiedFields;
    return this._modifiedFields;
  }
}

export type categoryProperties = Omit<
  Category,
  | "setName"
  | "setImage"
  | "sanitizeUser"
  | "setParentId"
  | "setIsListed"
  | "sanitizeCategory"
  | "modifiedFields"
  | "clearModifiedFields"
  | "setAncestors"
  | "setLevel"
>;
type modifiedFields = {
  [K in keyof Omit<categoryProperties, "id">]: boolean;
};
export type children = {
  children: Partial<categoryProperties>[];
};
export type categorieTreeItem = Partial<categoryProperties> & children;
