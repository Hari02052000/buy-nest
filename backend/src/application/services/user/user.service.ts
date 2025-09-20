import { APIError, AuthorizeError, User, userProperties, ValidationError } from "@/domain/entities";
import { userRepositoryInterface } from "@/domain/interfaces/repository";
import { userServiceInterface } from "@/domain/interfaces/services";
import { authUtillsInterface } from "@/domain/interfaces/utils";
import { tokenValidationUtillsInterface } from "@/domain/interfaces/utils";
import { validUserResponseType } from "@/domain/types";

export class userService implements userServiceInterface {
  constructor(
    private userRepository: userRepositoryInterface,
    private authUtills: authUtillsInterface,
    private tokenUtils: tokenValidationUtillsInterface,
  ) {}
  async LogoutUser(userToken: string): Promise<boolean> {
    if (!userToken) throw new ValidationError("token not found");
    const tokenProps = this.tokenUtils.isValidUserToken(userToken);
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const user = await this.userRepository.getUserById(tokenProps.payload.id);
      user.setRefreshToken("");
      const newUser = await this.userRepository.editUser(user);
      return true;
    }
    throw new APIError();
  }
  async getCurentUser(userToken: string): Promise<Partial<userProperties>> {
    if (!userToken) throw new ValidationError();
    const tokenProps = this.tokenUtils.isValidUserToken(userToken);
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const user = await this.userRepository.getUserById(tokenProps.payload.id);
      return user.sanitizeUser();
    }
    throw new AuthorizeError();
  }
  async refreshToken(refreshToken: string): Promise<validUserResponseType> {
    //cheak the refreshToken valid or not
    const tokenProps = this.tokenUtils.isValidUserToken(refreshToken);
    //get user with userid
    if (tokenProps.isVerified && tokenProps.payload.id) {
      const user = await this.userRepository.getUserById(tokenProps.payload.id);
      //generate accesstToken and refresh token
      const access_token = this.authUtills.generateAcessToken(user.email, user.id);
      const refresh_token = this.authUtills.generateRefreshToken(user.id);
      return {
        access_token,
        refresh_token,
        user: user.sanitizeUser(),
      };
    }
    throw new AuthorizeError();
  }

  async registerUser(requestBody: unknown): Promise<validUserResponseType> {
    const userInput = this.authUtills.validateUserRegisterInput(requestBody);
    const existUser = await this.userRepository.getUserByEmail(userInput.email);
    if (existUser) throw new ValidationError("email already exist");
    const userName = userInput.email.split("@")[0];
    const salt = await this.authUtills.getSalt();
    const hashedPassword = await this.authUtills.getHashedPassword(userInput.password, salt);
    const user = new User("", userName, userInput.email, false, undefined, hashedPassword, salt);
    const savedUser = await this.userRepository.saveUser(user);
    const access_token = this.authUtills.generateAcessToken(savedUser.email, savedUser.id);
    const refresh_token = this.authUtills.generateRefreshToken(savedUser.id);
    savedUser.setRefreshToken(refresh_token);
    //send email want done
    await this.userRepository.editUser(savedUser);
    return {
      access_token,
      refresh_token,
      user: savedUser.sanitizeUser(),
    };
  }
  async loginUser(requestBody: unknown): Promise<validUserResponseType> {
    //cheak the userInput valid or not
    const userInput = this.authUtills.validateUserLoginInput(requestBody);
    //get user with email
    const user = await this.userRepository.getUserByEmail(userInput.email);
    // find user is google loged or normal register
    if (user?.isGoogleProvided && user.googleId)
      throw new ValidationError("you allready registerd by google try google login");
    if (!user) throw new ValidationError("invalid email or password");
    const isPasswordValid = await this.authUtills.validatePassword(
      userInput.password,
      user.password!,
      user.salt!,
    );
    if (!isPasswordValid) throw new ValidationError("invalid email or password");
    //generate aceess_toekn and refresh_token
    const access_token = this.authUtills.generateAcessToken(user.email, user.id);
    const refresh_token = this.authUtills.generateRefreshToken(user.id);
    user.setRefreshToken(refresh_token);
    await this.userRepository.editUser(user);
    return {
      access_token,
      refresh_token,
      user: user.sanitizeUser(),
    };
  }
  async loginViaGoogle(
    email: string,
    googleId: string,
    name: string,
    profile: string,
  ): Promise<Partial<userProperties>> {
    let user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      const newUser = new User("", name, email, true, profile, undefined, undefined, googleId);
      user = await this.userRepository.saveUser(newUser);
    } else {
      user.setGoogleId(googleId);
      user.setProfile(profile);
      const updatedUser = await this.userRepository.editUser(user);
      if (updatedUser) user = updatedUser;
    }
    return user.sanitizeUser();
  }
  async googleSucessess(user: Partial<userProperties>): Promise<validUserResponseType> {
    if (!user.id) throw new ValidationError();
    let userDb = await this.userRepository.getUserById(user.id);
    const access_token = this.authUtills.generateAcessToken(user.email!, user.id);
    const refresh_token = this.authUtills.generateRefreshToken(user.id);
    userDb.setRefreshToken(refresh_token);
    await this.userRepository.editUser(userDb);
    return {
      access_token,
      refresh_token,
      user: userDb.sanitizeUser(),
    };
  }
}
