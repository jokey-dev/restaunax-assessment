export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const paginate = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit);
  return { page, limit, total, totalPages };
};

export const setupPagination = (page: number = 1, limit: number = 10) => {
  return { page, limit, skip: (page - 1) * limit };
};
