import axios from "axios";

export function getErrorMessage(error: unknown, fallback = "An unexpected error occurred.") {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return String((error as { message: string }).message);
  }

  return fallback;
}
