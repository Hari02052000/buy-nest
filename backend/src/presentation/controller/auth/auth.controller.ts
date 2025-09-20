import { userService } from "@/application/services";
import { userRepository } from "@/infrastructure/repository";
import { Request, Response, NextFunction } from "express";
import { authUtills } from "@/infrastructure/utils";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { adminRepository } from "@/infrastructure/repository/admin.repository";
import { adminService } from "@/application/services/admin/admin.service";
import { userProperties, ValidationError } from "@/domain/entities";
import { env } from "@/infrastructure/config/environment";
const userRepo = new userRepository();
const userServ = new userService(userRepo, authUtills, tokenUtils);
const adminRepo = new adminRepository();
const adminServ = new adminService(adminRepo, tokenUtils, authUtills);
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServ.loginUser(req.body);
    const { access_token, refresh_token, user } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie("refresh_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServ.registerUser(req.body);
    const { access_token, refresh_token, user } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const userRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refresh_token; // Expects from cookies
    const result = await userServ.refreshToken(token);
    const { access_token, refresh_token, user } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminServ.loginAdmin(req.body);
    const { access_token, refresh_token, admin } = result;
    res.cookie("access_token_admin", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token_admin", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ admin });
  } catch (error) {
    next(error);
  }
};

export const adminRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refresh_token_admin;
    const result = await adminServ.adminRefreshToken(token);
    const { access_token, refresh_token, admin } = result;
    res.cookie("access_token_admin", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token_admin", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ admin });
  } catch (error) {
    res.cookie("access_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    next(error);
  }
};

export const googleLoginSucessController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const passportUser = req.user as Partial<userProperties>;
    if (!passportUser) throw new ValidationError("failed to login");
    const result = await userServ.googleSucessess(passportUser);
    const { access_token, refresh_token, user } = result;
    res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.redirect(`${env.frontend_url_home}/`);
  } catch (error) {
    next(error);
  }
};

export const LogOutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const isLogout = await userServ.LogoutUser(token);
    res.cookie("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ isLogout });
  } catch (error) {
    next(error);
  }
};
