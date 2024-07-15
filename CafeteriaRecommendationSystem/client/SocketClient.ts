import { io, Socket } from "socket.io-client";
import readline from "readline";
import { CustomSocket } from "./types/customSocket";
import { LoginSignupHandler } from "./loginSignup";

export class SocketClient {
  private socket: CustomSocket;
  private rl: readline.Interface;

  constructor(serverUrl: string, rl: readline.Interface) {
    this.socket = io(serverUrl) as CustomSocket;
    this.rl = rl;
  }

  public connect(): void {
    this.socket.on("connect", this.handleConnect);
    this.socket.on("menuUpdated", this.handleMenuUpdated);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  private handleConnect = (): void => {
    console.log("Connected to the server");
    const loginSignupHandler = new LoginSignupHandler(this.socket, this.rl);
    loginSignupHandler.initiate();
  };

  private handleMenuUpdated = (data: any): void => {
    console.log(data.message);
  };

  private handleDisconnect = (): void => {
    console.log("Disconnected from the server");
  };
}
