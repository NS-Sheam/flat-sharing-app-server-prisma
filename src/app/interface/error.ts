export type TErrorDetails =
  | {
      issues: {
        field: string;
        message: string;
      }[];
    }
  | any;

export type TErrorResponse = {
  success: boolean;
  message: string;
  errorDetails: TErrorDetails;
};
