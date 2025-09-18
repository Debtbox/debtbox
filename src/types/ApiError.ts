export type ApiError = {
  response: {
    data: {
      error: string[];
    };
  };
  statusCode: number;
  timestamp: string;
  path: string;
  error: string[];
};
