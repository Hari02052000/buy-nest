import { container } from "tsyringe";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { CATEGORY_TOKENS } from "./category.tokens";

export function registerCategoryModule(): void {
  container.register(CATEGORY_TOKENS.Repository, { useClass: CategoryRepository });
  container.register(CATEGORY_TOKENS.Service, { useClass: CategoryService });
  container.register(CATEGORY_TOKENS.Controller, { useClass: CategoryController });
}
