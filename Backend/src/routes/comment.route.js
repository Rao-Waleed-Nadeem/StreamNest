import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sensitiveText } from "../middlewares/checkSensitiveContent.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(sensitiveText, addComment);
router
  .route("/c/:commentId")
  .delete(deleteComment)
  .patch(sensitiveText, updateComment);

export default router;
