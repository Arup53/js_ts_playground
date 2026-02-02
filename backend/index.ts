import express from "express";

const app = express();
const server_port = 9080;

console.log("Express app initialized");

app.get("/", (req, res) => {
  console.log("Received request to ", req);
  res.json({ message: "Hello from server" });
});

try {
  const server = app.listen("server_port", () => {
    console.log(`Server running at http://localhost:${server_port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${server_port} is already in use. Try a differemt port`
      );
    } else {
      console.log("server error:", err);
    }
  });
} catch (err) {
  console.log("Failed to start server:", err);
}
