"use server";

// TODO : add a webhook instead of revalidating path.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { handleError } from "@/lib/utils";
import User from "@/lib/models/user.model";
import Image from "@/lib/models/image.model";
import { getUserById } from "../data/user";

export const addImage = async ({ image, userId, path }: AddImageParams) => {
  try {
    await connectToDatabase();

    const author = await User.findOne({ user_id: userId });

    if (!author) throw new Error("User not found!");

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
};

export const updateImage = async ({
  image,
  userId,
  path,
}: UpdateImageParams) => {
  try {
    await connectToDatabase();

    const author = await User.findOne({ user_id: userId });

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== author._id)
      throw new Error("Unauthorized or image nor found");

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
};

export const deleteImage = async (imageId: string) => {
  try {
    await connectToDatabase();

    const image = await getImageById(imageId);
    const session = await auth();

    if (session?.user.id === image.author.user_id) {
      await Image.findByIdAndDelete(imageId);
    } else throw new Error("User not authorized");
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
};

export const getImageById = async (imageId: string) => {
  try {
    await connectToDatabase();

    const image = await Image.findById(imageId).populate({
      path: "author",
      model: User,
      select: "_id user_id firstName lastName",
    });

    if (!image) throw new Error("Image nor found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
};

export const getAllImages = async ({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) => {
  try {
    await connectToDatabase();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=imaginify";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    let query = {};

    if (searchQuery) {
      query = {
        publicId: {
          $in: resourceIds,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await Image.find(query)
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "author",
        model: User,
        select: "_id user_id firstName lastName",
      });

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
};

export const getUserImages = async ({
  limit = 9,
  page = 1,
}: {
  limit?: number;
  page: number;
}) => {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const session = await auth();
    const user = await getUserById(session?.user.id!);

    const images = await Image.find({ author: user._id })
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "author",
        model: User,
        select: "_id user_id firstName lastName",
      });

    const totalImages = await Image.find({ author: user._id }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
};
