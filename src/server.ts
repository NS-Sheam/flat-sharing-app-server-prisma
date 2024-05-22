import { Server } from "http";
import app from "./app";

const port = 3000;

async function server() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
server();
