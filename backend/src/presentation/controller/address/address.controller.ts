import { Request, Response, NextFunction } from "express";
import { tokenUtils, addressUtils } from "@/infrastructure/utils";
import { AddressRepository } from "@/infrastructure/repository/address.repository";
import { addressService } from "@/application/services/address/address.service";

const addressRepo = new AddressRepository();
const addressServ = new addressService(addressRepo, addressUtils, tokenUtils);

export const getAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const address = await addressServ.getAddress(token);
    return res.status(200).json({ address });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const address = await addressServ.createAddress(req.body, token);
    return res.status(200).json({ address });
  } catch (error) {
    next(error);
  }
};
