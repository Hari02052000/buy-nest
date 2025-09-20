import { Request, Response, NextFunction } from "express";
import { userService } from "@/application/services";
import { userRepository } from "@/infrastructure/repository";
import { authUtills } from "@/infrastructure/utils";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { ResponseUtils } from "@/infrastructure/utils/response.utils";

const userRepo = new userRepository();
const userServ = new userService(userRepo, authUtills, tokenUtils);

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields
    const { userName } = req.body;
    if (userName) {
      user.setUserName(userName);
    }

    const updatedUser = await userRepo.editUser(user);
    const sanitizedUser = updatedUser.sanitizeUser();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: sanitizedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;
    const user = await userServ.getCurentUser(token);
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Handle file upload logic here (using multer or similar)
    // For now, assuming the image URL is provided
    const imageUrl = req.body.imageUrl; // This would come from your file upload service

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.setProfile(imageUrl);
    const updatedUser = await userRepo.editUser(user);
    const sanitizedUser = updatedUser.sanitizeUser();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        user: sanitizedUser,
        imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.setProfile(""); // Remove profile image
    const updatedUser = await userRepo.editUser(user);
    const sanitizedUser = updatedUser.sanitizeUser();

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    next(error);
  }
};
