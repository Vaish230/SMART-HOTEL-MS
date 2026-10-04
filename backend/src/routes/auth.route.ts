import { Router } from "express";
import {
    signupController,
    loginController,
    logoutController,
    verifyOtpController,
    resendOtpController,
    forgotPasswordController,
    verifyResetOtpController,
    resetPasswordController
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-reset-otp", verifyResetOtpController);
router.post("/reset-password", resetPasswordController)
router.get("/me", authMiddleware, (req, res) => {
    return res.json({
        message: "Authenticated",
        user: res.locals.user,
    });
});

router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("ADMIN"),
    (req, res) => {
        return res.json({
            message: "Welcome Admin",
        });
    }
);

export default router;