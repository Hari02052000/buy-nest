import { AuthorizeError, Product, productProperties, ValidationError } from "@/domain/entities";
import { productRepositoryInterface } from "@/domain/interfaces/repository";
import { ProductServiceInterface } from "@/domain/interfaces/services";
import { cloudUtillsInterface } from "@/domain/interfaces/utils";
import { productUtilsInterface } from "@/domain/interfaces/utils";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";
import { ProductSearchFilters, ProductSearchResult } from "@/domain/types/product.request.type";

export class productService implements ProductServiceInterface {
  constructor(
    private productRepo: productRepositoryInterface,
    private productUtils: productUtilsInterface,
    private tokenUtils: tokenValidationUtillsInterface,
    private cloudUtils: cloudUtillsInterface,
  ) {}
  async createProduct(files: any, reqBody: any, adminToken: string): Promise<Partial<productProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!files || files.length === 0) throw new ValidationError("images is empty");
    const productProperties = this.productUtils.validateCreateProductRequest(reqBody);
    const existingProduct = await this.productRepo.getUniqueProduct(
      productProperties.name,
      productProperties.brand,
      productProperties.model,
    );
    if (existingProduct) throw new ValidationError("product with same name,brand,model is exist");
    const images = await this.cloudUtils.uploadMultiFiles(files);
    const product = new Product(
      "",
      productProperties.name,
      images,
      productProperties.description,
     parseFloat(productProperties.price),
      productProperties.category,
      productProperties.brand,
      productProperties.model,
      productProperties.stock,
    );
    const savedProduct = await this.productRepo.saveProduct(product);
    return savedProduct.sanitizeProduct();
  }
  async getProducts(
    limit: number = 20,
    skip: number = 0,
    category?: string,
    search?: string,
    adminToken?: string,
    brand?: string,
    model?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Partial<productProperties>[]> {
    const allProducts = await this.productRepo.getPopulatedProducts(
      limit,
      skip,
      category,
      search,
      brand,
      model,
      minPrice,
      maxPrice,
    );
    let products;
    let totelPages;
    if (adminToken) {
      const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
      if (!isAdmin) throw new AuthorizeError();
      products = allProducts;
    } else {
      products = allProducts.filter(
        (product) => product.isListed && typeof product.category === "object" && product.category.isListed,
      );
    }
    return products.map((product) => product.sanitizeProduct());
  }
  async editProduct(id: string, reqBody: any, adminToken: string): Promise<Partial<productProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    const editCatProps = this.productUtils.validateEditCategoryRequest(reqBody);
    const product = await this.productRepo.getSingleProduct(id);
    if (editCatProps.brand && editCatProps.brand !== product.brandName) {
      const existingProduct = await this.productRepo.getUniqueProduct(
        product.name,
        editCatProps.brand,
        product.modelName,
      );
      if (existingProduct) throw new ValidationError("product with same name,brand,model is exist");
      product.setBrand(editCatProps.brand);
    }
    if (editCatProps.description && editCatProps.description !== product.description) {
      product.setDescription(editCatProps.description);
    }
    if (editCatProps.model && editCatProps.model !== product.modelName) {
      const existingProduct = await this.productRepo.getUniqueProduct(
        product.name,
        product.brandName,
        editCatProps.model,
      );
      if (existingProduct) throw new ValidationError("product with same name,brand,model is exist");
      product.setModel(editCatProps.model);
    }
    if (editCatProps.name && editCatProps.name !== product.name) {
      const existingProduct = await this.productRepo.getUniqueProduct(
        editCatProps.name,
        product.brandName,
        product.modelName,
      );
      if (existingProduct) throw new ValidationError("product with same name,brand,model is exist");
      product.setName(editCatProps.name);
    }
    if (editCatProps.price && parseFloat(editCatProps.price) !== product.price) {
      product.setPrice(parseFloat(editCatProps.price));
    }
    if (editCatProps.stock && editCatProps.stock !== product.stock) {
      product.setStock(editCatProps.stock);
    }
    const updatedProduct = await this.productRepo.editProduct(product);
    return updatedProduct.sanitizeProduct();
  }
  async uploadImages(id: string, files: any, adminToken: string): Promise<Partial<productProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!files || files.length === 0) throw new ValidationError("images is empty");
    const product = await this.productRepo.getSingleProduct(id);
    const images = await this.cloudUtils.uploadMultiFiles(files);
    const concatImages = [...product.images, ...images];
    product.setImages(concatImages);
    const updatedProduct = await this.productRepo.editProduct(product);
    return updatedProduct.sanitizeProduct();
  }
  async deletemage(
    id: string,
    image: { id: string; url: string },
    adminToken: string,
  ): Promise<Partial<productProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    if (!image || !image.id || !image.url) throw new ValidationError("image not found");
    const product = await this.productRepo.getSingleProduct(id);
    await this.cloudUtils.deleteImage(image.id);
    const updatedImages = product.images.filter((productImage) => productImage.id !== image.id);
    product.setImages(updatedImages);
    const updatedProduct = await this.productRepo.editProduct(product);
    return updatedProduct.sanitizeProduct();
  }
  async changeListStaus(
    id: string,
    isListed: boolean,
    adminToken: string,
  ): Promise<Partial<productProperties>> {
    const isAdmin = this.tokenUtils.isValidAdminToken(adminToken);
    if (!isAdmin) throw new AuthorizeError();
    const product = await this.productRepo.getSingleProduct(id);
    product.setIsListed(isListed);
    const updatedProduct = await this.productRepo.editProduct(product);
    return updatedProduct.sanitizeProduct();
  }
  async searchProducts(filters: ProductSearchFilters): Promise<ProductSearchResult> {
    const { query, category, minPrice, maxPrice, brand, model, limit = 20, skip = 0 } = filters;

    const products = await this.productRepo.searchProducts(
      query,
      category,
      minPrice,
      maxPrice,
      brand,
      model,
      limit,
      skip,
    );

    const totalProducts = await this.productRepo.countProducts(
      query,
      category,
      minPrice,
      maxPrice,
      brand,
      model,
    );

    return {
      products: products.map((product) => product.sanitizeProduct()),
      total: totalProducts,
      pageSize: limit,
      skip,
    };
  }

  async getSingleProduct(id: string): Promise<Partial<productProperties>> {
    const product = await this.productRepo.getSingleProduct(id);
    return product.sanitizeProduct();
  }
}
