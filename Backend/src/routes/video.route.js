import { Router } from "express";
import {
  advancedSearch,
  deleteVideo,
  getAllVideos,
  getQueryVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  addView,
  getTotalVideosSize,
  getUserVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { sensitiveText } from "../middlewares/checkSensitiveContent.js";

const router = Router();

router.route("/all-videos").get(getAllVideos); // No auth required

// Apply verifyJWT to all other routes explicitly
router
  .route("/")
  .get(verifyJWT, getQueryVideos)
  .post(
    verifyJWT,
    sensitiveText,
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route("/:videoId")
  .get(verifyJWT, getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, sensitiveText, upload.single("thumbnail"), updateVideo);

router.route("/:videoId/:userId").patch(verifyJWT, addView);

router.route("/total-videos/:userId").get(verifyJWT, getTotalVideosSize);

router.route("/search").get(verifyJWT, advancedSearch);

router.route("/:userId").get(verifyJWT, getUserVideos);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
