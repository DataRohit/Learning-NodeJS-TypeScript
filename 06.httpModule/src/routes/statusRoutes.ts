import http from "node:http";

export async function handleStatusRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const { url } = req;

  // Extract status code from URL e.g., /api/status/200
  const statusCodeMatch = url?.match(/\/api\/status\/(\d+)/);
  const code = statusCodeMatch ? parseInt(statusCodeMatch[1]) : null;

  if (code) {
    switch (code) {
      case 200:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ code: 200, message: "OK: Success" }));
        break;

      case 201:
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: 201,
            message: "Created: Resource successfully created",
          }),
        );
        break;

      case 204:
        // No Content - should not have a body
        res.writeHead(204);
        res.end();
        break;

      case 400:
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ code: 400, message: "Bad Request: Invalid syntax" }),
        );
        break;

      case 401:
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: 401,
            message: "Unauthorized: Authentication required",
          }),
        );
        break;

      case 403:
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ code: 403, message: "Forbidden: Access denied" }),
        );
        break;

      case 404:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: 404,
            message: "Not Found: Resource doesn't exist",
          }),
        );
        break;

      case 500:
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: 500,
            message: "Internal Server Error: Unexpected failure",
          }),
        );
        break;

      default:
        res.writeHead(code, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ code, message: `Status code ${code} returned` }),
        );
        break;
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Please provide a status code in the URL, e.g., /api/status/200",
      }),
    );
  }
}
