export const API_ROUTES = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    VERIFY_OTP: "/verifyOtp",
    RESEND_OTP: "/resendOtp",
    FORGOT_PASSWORD: "/forgotPassword",
    VERIFY_RESET_PASSWORD_OTP: "/verifyResetPasswordOtp",
    RESET_PASSWORD: "/resetPassword",
  },

  RESTAURANT: {
    ADD: "/restaurant",
    GET_ALL: "/restaurants",
    DELETE: "/restaurant/:id",
    UPDATE: "/restaurant/:id",
  },
};