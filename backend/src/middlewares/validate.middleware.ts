import { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyObjectSchema } from "yup";
import * as apiResponse from "../utils/response.util";

export const validate = (schema: AnyObjectSchema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      return apiResponse.validationErrorWithData(res, error.errors);
    }
  };
};
