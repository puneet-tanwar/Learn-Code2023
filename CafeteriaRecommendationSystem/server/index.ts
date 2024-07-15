import { createServer } from "http";
import { SocketServer } from "./SocketServer";

const httpServer = createServer();
const socketServer = new SocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});
