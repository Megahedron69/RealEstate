import prisma from "../config/prisma";
import { ApiError } from "../middlewares/errorMiddleware";

const getAllPropertiesService = async (
  filters: any,
  sortBy: string,
  sortOrder: "asc" | "desc",
  page: number,
  limit: number
) => {
  try {
    const allProperties = await prisma.properties.findMany({
      where: filters,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });
    const allPropertiesCount = await prisma.properties.count({
      where: filters,
    });
    return {
      allProperties,
      totalProperties: allPropertiesCount,
      currentPage: page,
      totalPages: Math.ceil(allPropertiesCount / limit),
    };
  } catch (error: any) {
    throw new ApiError(500, "Failed to create user", [
      { reason: error.message },
    ]);
  }
};

const getPropertyByIdService = async (id: string) => {
  try {
    return await prisma.properties.findUnique({ where: { id } });
  } catch (error: any) {
    throw new ApiError(500, "Failed to get property with id", [
      { reason: error.message },
    ]);
  }
};

const createApropertyService = async (propertyData: any, userId: string) => {
  try {
    const newProperty = await prisma.properties.create({
      data: {
        id: propertyData.id,
        name: propertyData.name,
        description: propertyData.description,
        listingCreatedBy: userId,
        price: Number(propertyData.price),
        isRentable: Boolean(propertyData.isRentable),
        propertyType: propertyData.propertyType,
        numBedrooms: Number(propertyData.numBedrooms),
        numBathrooms: Number(propertyData.numBathrooms),
        numKitchens: Number(propertyData.numKitchens),
        propertyStatus: propertyData.propertyStatus,
        location: propertyData.location,
        latitude: propertyData.latitude ? Number(propertyData.latitude) : null,
        longitude: propertyData.longitude
          ? Number(propertyData.longitude)
          : null,
        areaSize: propertyData.areaSize ? Number(propertyData.areaSize) : null,
        amenities: Array.isArray(propertyData.amenities)
          ? propertyData.amenities
          : [],
        images: Array.isArray(propertyData.images) ? propertyData.images : [],
      },
    });
    return newProperty;
  } catch (error: any) {
    throw new ApiError(500, "Failed to create property", [
      { reason: error.message },
    ]);
  }
};

const updateApropertyService = async (id: string, updateData: any) => {
  try {
    const existingProperty = await prisma.properties.findUnique({
      where: { id },
    });
    if (!existingProperty) {
      throw new ApiError(404, "Property not found");
    }

    const updatedProperty = await prisma.properties.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return updatedProperty;
  } catch (error: any) {
    throw new ApiError(500, "Failed to update property", [
      { reason: error.message },
    ]);
  }
};

const deletePropertyService = async (propertyId: string, userId: string) => {
  try {
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, "Property not found");
    }
    if (property.listingCreatedBy !== userId) {
      throw new ApiError(403, "You are not allowed to delete this property");
    }
    await prisma.properties.delete({ where: { id: propertyId } });
  } catch (error: any) {
    throw new ApiError(500, "Failed to delete property", [
      { reason: error.message },
    ]);
  }
};

export {
  getAllPropertiesService,
  getPropertyByIdService,
  createApropertyService,
  updateApropertyService,
  deletePropertyService,
};
