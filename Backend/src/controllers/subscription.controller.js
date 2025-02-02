import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (channelId == req.user?._id) {
    throw new apiError(400, "You cannot subscribe to your own channel.");
  }

  if (!channelId) {
    throw new apiError(400, "Channel ID is required for subscription.");
  }

  // Find the subscription for this channel
  let subscription = await Subscription.findOne({ channel: channelId });

  if (!subscription) {
    // Create a new subscription if none exists
    const newSubscription = await Subscription.create({
      channel: channelId, // Store as a single value, not an array
      subscriber: [req.user?._id], // Initialize subscriber as an array
    });

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          newSubscription,
          "Subscribed to channel successfully."
        )
      );
  }

  // Check if the user is already subscribed
  const isSubscribed = subscription.subscriber.some(
    (id) => id.toString() === req.user?._id.toString()
  );

  if (isSubscribed) {
    // Unsubscribe the user
    subscription.subscriber = subscription.subscriber.filter(
      (id) => id.toString() !== req.user?._id.toString()
    );

    await subscription.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          subscription,
          "Unsubscribed from channel successfully."
        )
      );
  }

  // Add the user to the subscriber list
  subscription.subscriber.push(req.user?._id);

  // Save the updated subscription
  await subscription.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new apiResponse(200, subscription, "Subscription toggled successfully.")
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate channelId
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new apiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) }, // Match the channel ID
    },
    {
      $project: {
        subscriber: 1, // Include only the subscriber field
      },
    },
    {
      $lookup: {
        from: "users", // Reference the users collection
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              username: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$subscriber", // Flatten the subscriber array
        preserveNullAndEmptyArrays: true, // Handle cases where there are no matches
      },
    },
  ]);

  if (subscribers.length === 0) {
    return res
      .status(200)
      .json(
        new apiResponse(200, [], "This channel is not subscribed by anyone")
      );
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new apiError(400, "Subscriber ID is required.");
  }

  const channels = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) }, // Ensure `subscriberId` is an ObjectId
    },
    {
      $project: {
        channel: 1, // Include only the `channel` field
      },
    },
    {
      $lookup: {
        from: "users", // Collection name for users
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              username: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$channel", // Flatten the `channel` array to make it easier to use
    },
  ]);

  if (channels.length === 0) {
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          [],
          "This user has not subscribed to any channels."
        )
      );
  }

  return res
    .status(200)
    .json(new apiResponse(200, channels, "Channels fetched successfully."));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
