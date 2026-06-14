import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import axios from 'axios'
dotenv.config()
const app=express()
app.use(express.json())

const server=http.createServer(app)      //create node.js server
const port = process.env.PORT || 5000

// socket configure
const io=new Server(server,{
    cors:{
        origin:process.env.NEXT_BASE_URL
    }
})

//connect with frontend 
io.on("connection",(socket)=>{                                         //when user first time connect with socket then socket create a socket id
  console.log("user connected",socket.id)

  socket.on("identity", async(userId)=>{                              //socket.on use to take the data
    // console.log(userId)                             
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`,{userId,socketId:socket.id})    
  })

  socket.on("update-location",async({userId, latitude, longitude})=>{
    const location={
      type:"Point",
      coordinates:[longitude,latitude]
    }

    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`,{userId,location})

    io.emit("update-deliveryBoy-location",{userId,location})
    
  })

  socket.on("join-room",(roomId)=>{
    socket.join(roomId)                      //socket.join use to join the room
    console.log(`user ${socket.id} joined room ${roomId}`)
  })

  socket.on("send-message",async (message)=>{
    // console.log(message);
    await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`, message)
    console.log(message)
    io.to(message.roomId).emit("send-message",message)         //io.to use for send the data to perticular roomId and emit use to send the data 
    
  })

  //disconnect the socket from frontend
  socket.on("disconnect", ()=>{
    console.log("user disconnected",socket.id)
  })

})

app.post('/notify',(req,res)=>{
  const {event,data,socketId}=req.body
  if(socketId){
    io.to(socketId).emit(event,data)                               //io.to use for send the data to perticular socketId
  }else{
    io.emit(event,data)                                            //io.emit use to send the data everyone
  }

  return res.status(200).json({"success" : true})
  
})

server.listen(port, ()=>{
    console.log("server start at port",port)
})