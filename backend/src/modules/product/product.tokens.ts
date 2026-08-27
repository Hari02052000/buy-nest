import { container } from "tsyringe";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

export const PRODUCT_TOKENS = {
  Repository: Symbol("ProductRepository"),
  Service: Symbol("ProductService"),
  Controller: Symbol("ProductController"),
} as const;

export function registerProductModule(): void {
  container.register(PRODUCT_TOKENS.Repository, { useClass: ProductRepository });
  container.register(PRODUCT_TOKENS.Service, { useClass: ProductService });
  container.register(PRODUCT_TOKENS.Controller, { useClass: ProductController });
}
