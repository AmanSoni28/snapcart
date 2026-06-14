import { io, Socket } from "socket.io-client";

let socket:Socket|null=null

// connect the socket with backend and use every where
export const getSocket=()=>{
    if(!socket){
        socket=io(process.env.NEXT_PUBLIC_SOCKET_SERVER)
    }
    return socket
}