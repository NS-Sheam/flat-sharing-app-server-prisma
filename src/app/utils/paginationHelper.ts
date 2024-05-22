type TOptions = {
  page: number;
  limit: number;
  total: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};
type TOptionResponse = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const calculatePagination = (options: TOptions): TOptionResponse => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: "asc" | "desc" = options.sortOrder || "asc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const PaginationHelper = {
  calculatePagination,
};
