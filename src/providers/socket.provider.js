import socketIOClient from "socket.io-client";
//http://localhost:3002
const ENDPOINT = "http://127.0.0.1:3002";
export const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});