export function getApiHost(endpoint) {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8000/api" + endpoint;
  } else {
    return "/api";
  }
}
