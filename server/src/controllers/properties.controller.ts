import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { uploadImagesToSupabase } from "../utils/uploadImages";
import {
  getAllPropertiesService,
  updateApropertyService,
  createApropertyService,
  getPropertyByIdService,
  deletePropertyService,
} from "../services/properties.service";
import { ApiError } from "../middlewares/errorMiddleware";
import type { AuthenticatedRequest } from "../types/customTypes";

const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      priceMin,
      priceMax,
      numBedrooms,
      numBathrooms,
      numKitchens,
      propertyType,
      propertyStatus,
      isRentable,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.params;
    const filters: any = {};

    if (priceMin) filters.price = { gte: Number(priceMin) };
    if (priceMax) filters.price = { ...filters.price, lte: Number(priceMax) };
    if (numBedrooms) filters.numBedrooms = Number(numBedrooms);
    if (numBathrooms) filters.numBathrooms = Number(numBathrooms);
    if (numKitchens) filters.numKitchens = Number(numKitchens);
    if (propertyType) filters.propertyType = propertyType;
    if (propertyStatus) filters.propertyStatus = propertyStatus;
    if (isRentable !== undefined) filters.isRentable = isRentable === "true";
    if (location)
      filters.location = { contains: location, mode: "insensitive" };

    const pageNumber = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.max(1, parseInt(limit as string, 10));

    const allPropertiesData = await getAllPropertiesService(
      filters,
      sortBy as string,
      sortOrder as "asc" | "desc",
      pageNumber,
      pageSize
    );

    res.status(200).json({ success: true, data: allPropertiesData });
  } catch (error: any) {
    next(error);
  }
};

const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const property = await getPropertyByIdService(id);

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

const createAproperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      price,
      isRentable,
      propertyType = "HOUSE",
      numBedrooms,
      numBathrooms,
      numKitchens,
      propertyStatus = "AVAILABLE",
      location,
      latitude,
      longitude,
      areaSize,
      amenities,
    } = req.body;

    if (!req.user || !req.user.id) {
      throw new ApiError(401, "Unauthorized access");
    }
    const propertyId = uuidv4();
    const imageUrls = await uploadImagesToSupabase(
      req.files?.images,
      propertyId
    );

    const propertyData = {
      id: propertyId,
      name,
      description,
      price,
      isRentable,
      propertyType,
      numBedrooms,
      numBathrooms,
      numKitchens,
      propertyStatus,
      location,
      latitude,
      longitude,
      areaSize,
      amenities,
      images: imageUrls,
    };

    const newProperty = await createApropertyService(propertyData, req.user.id);
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (error) {
    next(error);
  }
};

const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.files?.images) {
      const imageUrls = await uploadImagesToSupabase(req.files.images, id);
      updateData.images = imageUrls;
    }

    const updatedProperty = await updateApropertyService(id, updateData);

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      throw new ApiError(401, "Unauthorized access");
    }

    await deletePropertyService(id, req.user.id);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllProperties,
  getPropertyById,
  createAproperty,
  updateProperty,
  deleteProperty,
};
