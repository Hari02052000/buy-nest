"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor(id = "", name, image, parentId, ancestors, level) {
        this.ancestors = [];
        this.level = 0;
        this.isListed = true;
        this._modifiedFields = {};
        this.id = id;
        this.name = name;
        this.image = image;
        if (parentId)
            this.parentId = parentId;
        if (ancestors)
            this.ancestors = ancestors;
        if (level !== undefined)
            this.level = level;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
    setName(name) {
        this.name = name;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.name = true;
        this._modifiedFields.updatedAt = true;
    }
    setImage(image) {
        this.image = image;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.image = true;
        this._modifiedFields.updatedAt = true;
    }
    setAncestors(ancestors) {
        this.ancestors = ancestors;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.ancestors = true;
        this._modifiedFields.updatedAt = true;
    }
    setLevel(level) {
        this.level = level;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.level = true;
        this._modifiedFields.updatedAt = true;
    }
    setParentId(id) {
        this.parentId = id;
        this.updatedAt = new Date().toISOString();
        this.modifiedFields.parentId = true;
        this._modifiedFields.updatedAt = true;
    }
    setIsListed(isListed) {
        this.isListed = isListed;
        this.updatedAt = new Date().toISOString();
        this._modifiedFields.isListed = true;
        this.modifiedFields.updatedAt = true;
    }
    sanitizeCategory() {
        const category = {};
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
    get modifiedFields() {
        return this._modifiedFields;
    }
    get clearModifiedFields() {
        this._modifiedFields = {};
        return this._modifiedFields;
    }
}
exports.Category = Category;
