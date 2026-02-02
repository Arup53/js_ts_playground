import express from "express";
import { anonEventsRegisters } from "./routes/events_register_anon";

const app = express();
const server_port = 3000;

app.use(express.json())

// app.get("/", (req, res) => {
//   console.log("Received request to ", req);
//   res.json({ message: "Hello from server" });
// });
app.get('/',async(req,res)=>{
  res.send("Hello from server")
})
app.use("/backend/routes/events_register_anon",anonEventsRegisters)

try {
  const server = app.listen(server_port, () => {
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
