import { Router } from "express";
import { oauth2Client } from "../config/google.ts";

const router = Router();

router.get("/auth", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.send",
        ],
        prompt: "consent",
    });

    res.redirect(authUrl);
});

export default router;