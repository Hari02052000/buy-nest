import { container } from "tsyringe";
import { WishlistRepository } from "./wishlist.repository";
import { WishlistService } from "./wishlist.service";
import { WishlistController } from "./wishlist.controller";
import { WISHLIST_TOKENS } from "./wishlist.tokens";

export function registerWishlistModule(): void {
  container.register(WISHLIST_TOKENS.Repository, { useClass: WishlistRepository });
  container.register(WISHLIST_TOKENS.Service, { useClass: WishlistService });
  container.register(WISHLIST_TOKENS.Controller, { useClass: WishlistController });
}
