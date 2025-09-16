export type ApiError = {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string[];
};
