import { container } from "tsyringe";
import { WishlistRepository } from "./wishlist.repository";
import { WishlistService } from "./wishlist.service";
import { WishlistController } from "./wishlist.controller";

export const WISHLIST_TOKENS = {
  Repository: Symbol("WishlistRepository"),
  Service: Symbol("WishlistService"),
  Controller: Symbol("WishlistController"),
};

export function registerWishlistModule(): void {
  container.register(WISHLIST_TOKENS.Repository, { useClass: WishlistRepository });
  container.register(WISHLIST_TOKENS.Service, { useClass: WishlistService });
  container.register(WISHLIST_TOKENS.Controller, { useClass: WishlistController });
}
