import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticate, (req: AuthRequest, res: Response): void => {
  res.json({
    message: "You are authenticated!",
    user: req.user,
  });
});

export default router;
