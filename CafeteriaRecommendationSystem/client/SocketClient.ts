import { io } from "socket.io-client";
import readline from "readline";
import { CustomSocket } from "./types/customSocket";
import { LoginSignupHandler } from "./loginSignup";
import { UserOperationsHandler } from "./userOperations";

export class SocketClient {
  private socket: CustomSocket;
  private rl: readline.Interface;

  constructor(serverUrl: string, rl: readline.Interface) {
    this.socket = io(serverUrl) as CustomSocket;
    this.rl = rl;
  }

  public connect() {
    this.socket.on("connect", () => {
      console.log("Connected to the server");
      const loginSignupHandler = new LoginSignupHandler(this.socket, this.rl);
      loginSignupHandler.initiate();
    });

    this.socket.on("menuUpdated", (data)=> {
        console.log(data.message);
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
  }
}
