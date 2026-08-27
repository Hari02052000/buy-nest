import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { container } from "tsyringe";
import { AUTH_TOKENS } from "./auth.tokens";
import { AuthService } from "./auth.service";
import { env } from "@/shared/config/environment";

const authService = container.resolve<AuthService>(AUTH_TOKENS.Service);

if (env.google_client_id && env.google_client_secret && env.google_callback_url) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_url,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          if (!profile.emails || profile.emails.length === 0) {
            done(new Error("Google account has no email"), undefined);
            return;
          }
          const user = await authService.loginViaGoogle(
            profile.emails[0].value,
            profile.id,
            profile.displayName,
            (profile._json as any)?.picture || "",
          );
          done(null, user as any);
        } catch (error) {
          done(error as Error, undefined);
        }
      },
    ),
  );
}

export default passport;
