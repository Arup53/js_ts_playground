import express from "express";
import serverless from "serverless-http";
import { anonEventsRegisters } from "./routes/events_register_anon";
import { postAnonymousEvents } from "./routes/postAnonymousEvents";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming path:", req.path);
  next();
});

app.get("/health", async (req, res) => {
  res.send("Hello from server");
});
app.use("/api/routes/events_register_anon", anonEventsRegisters);

app.use("/api/routes/events/anonymous", postAnonymousEvents);

export const handler = serverless(app, {
  basePath: "/api_server_customerio",
});

// try {
//   const server = app.listen(server_port, () => {
//     console.log(`Server running at http://localhost:${server_port}`);
//   });

//   server.on("error", (err) => {
//     if (err.code === "EADDRINUSE") {
//       console.log(
//         `Port ${server_port} is already in use. Try a differemt port`
//       );
//     } else {
//       console.log("server error:", err);
//     }
//   });
// } catch (err) {
//   console.log("Failed to start server:", err);
// }
