export type ApiError = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: {
    data: {
      message: string;
    };
  };
};
