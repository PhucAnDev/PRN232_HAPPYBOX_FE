export const getErrorMessage = (
  error: unknown,
  fallback = "Da xay ra loi",
) => {
  const axiosLikeError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
    message?: string;
  };

  const validationErrors = axiosLikeError?.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.values(validationErrors)
      .flat()
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join("\n");
    }
  }

  return (
    axiosLikeError?.response?.data?.message ||
    axiosLikeError?.message ||
    fallback
  );
};
