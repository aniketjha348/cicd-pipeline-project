export const badResponse = ({
  res,
  statusCode = 400,
  status = false,
  message = "Something went wrong",
  error = {},
  isAuthenticated = false,
} = {}) => {
  if (!res) {
    throw new Error("Response object (res) is required");
  }

  return res.status(statusCode).json({
    status,
    statusCode,
    message,
    error,
    isAuthenticated :false,
  });
};

export const goodResponse = ({
  res,
  statusCode = 200,
  status = true,
  message = "Successful",
  data = {},
  extra = {}
} = {}) => {
  if (!res) {
    throw new Error("Response object (res) is required");
  }

  return res.status(statusCode).json({
    status,
    statusCode,
    message,
    ...data,
    isAuthenticated: true,
    ...extra // optional for future use like pagination, meta, etc.
  });
};