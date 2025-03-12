import fileUpload from "express-fileupload";
export const fileUploadMiddleware = fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  useTempFiles: false,
});
