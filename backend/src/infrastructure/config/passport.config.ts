import passport from "passport";
import { Strategy as GoogleStartegy } from "passport-google-oauth20";
import { env } from "./environment";
import { userService } from "@/application/services";
import { userRepository } from "@/infrastructure/repository";
import { authUtills } from "@/infrastructure/utils";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { ValidationError } from "@/domain/entities";

const userRepo = new userRepository();
const userServ = new userService(userRepo, authUtills, tokenUtils);

console.log(env.google_callback_url);

if (!env.google_client_id || !env.google_client_secret || !env.google_callback_url) {
  throw new Error("dot env not have google ids");
}

passport.use(
  new GoogleStartegy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_callback_url,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          throw new ValidationError("Google account has no email associated");
        }
        const user = await userServ.loginViaGoogle(
          profile.emails[0].value,
          profile.id,
          profile.displayName,
          profile._json.picture as string,
        );
        done(null, user);
      } catch (error) {
        done(
          new ValidationError("google login faild try again conform emails are present with google account"),
        );
      }
    },
  ),
);
export default passport;
