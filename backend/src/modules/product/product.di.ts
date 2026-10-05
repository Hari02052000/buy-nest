import { container } from "tsyringe";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PRODUCT_TOKENS } from "./product.tokens";

export function registerProductModule(): void {
  container.register(PRODUCT_TOKENS.Repository, { useClass: ProductRepository });
  container.register(PRODUCT_TOKENS.Service, { useClass: ProductService });
  container.register(PRODUCT_TOKENS.Controller, { useClass: ProductController });
}
