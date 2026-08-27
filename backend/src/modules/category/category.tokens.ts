import { container } from "tsyringe";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";

export const CATEGORY_TOKENS = {
  Repository: Symbol("CategoryRepository"),
  Service: Symbol("CategoryService"),
  Controller: Symbol("CategoryController"),
};

export function registerCategoryModule(): void {
  container.register(CATEGORY_TOKENS.Repository, { useClass: CategoryRepository });
  container.register(CATEGORY_TOKENS.Service, { useClass: CategoryService });
  container.register(CATEGORY_TOKENS.Controller, { useClass: CategoryController });
}
