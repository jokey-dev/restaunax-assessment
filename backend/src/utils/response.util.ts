import { Response } from "express";

export const success = (res: Response, message: string): Response => {
  return res.status(200).json({
    status: true,
    message,
  });
};

export const successData = <T = any>(res: Response, message: string, data: T): Response => {
  return res.status(200).json({
    status: true,
    message,
    data,
  });
};

export const recordCreated = <T = any>(res: Response, message: string, data: T): Response => {
  return res.status(201).json({
    status: true,
    message,
    data,
  });
};

export const Error = (res: Response, message: string): Response => {
  return res.status(500).json({
    status: false,
    message,
  });
};

export const status = (res: Response, message: string): Response => {
  return res.status(422).json({
    status: false,
    message,
  });
};

export const notFound = (res: Response, message: string): Response => {
  return res.status(404).json({
    status: false,
    message,
  });
};

export const validationErrorWithData = <T = any>(res: Response, data: T): Response => {
  return res.status(422).json({
    status: false,
    errors: data,
  });
};

export const validationError = (res: Response, message: string): Response => {
  return res.status(400).json({
    status: false,
    message,
  });
};

export const validationConflict = (res: Response, message: string): Response => {
  return res.status(409).json({
    status: false,
    message,
  });
};

export const unauthorizedResponse = (res: Response, message: string): Response => {
  return res.status(401).json({
    status: false,
    message,
  });
};

export const forbiddenResponse = (res: Response, message: string): Response => {
  return res.status(403).json({
    status: false,
    message,
  });
};


export const paginatedData = <T = any>(
  res: Response,
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    status: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
};
