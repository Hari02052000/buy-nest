import passport from "@/infrastructure/config/passport.config";

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleLoginMiddleware = passport.authenticate("google", {
  session: false,
  failWithError: true,
});
