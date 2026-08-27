import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AddressService } from "./address.service";
import { ADDRESS_TOKENS } from "./address.tokens";
import { ResponseUtils } from "@/shared/utils/response.utils";

@injectable()
export class AddressController {
  constructor(
    @inject(ADDRESS_TOKENS.Service) private addressService: AddressService,
  ) {}

  createAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const address = await this.addressService.createAddress(req.user!.id, req.body);
      res.json(ResponseUtils.success({ address }, "Address created"));
    } catch (error) {
      next(error);
    }
  };

  getAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addresses = await this.addressService.getAddresses(req.user!.id);
      res.json(ResponseUtils.success({ addresses }));
    } catch (error) {
      next(error);
    }
  };

  getAddressById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const address = await this.addressService.getAddressById(req.params.id);
      res.json(ResponseUtils.success({ address }));
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const address = await this.addressService.updateAddress(req.params.id, req.user!.id, req.body);
      res.json(ResponseUtils.success({ address }, "Address updated"));
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.addressService.deleteAddress(req.params.id, req.user!.id);
      res.json(ResponseUtils.success({ deleted: true }, "Address deleted"));
    } catch (error) {
      next(error);
    }
  };
}
