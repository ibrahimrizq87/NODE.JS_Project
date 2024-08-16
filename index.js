import express, { json } from "express";
import postsRoutes from "./posts/posts.routes.js";
import userRoutes from "./users/users.routes.js";

const server = express();
server.use(json());
server.use(postsRoutes);
server.use(userRoutes);
server.use('*',(req,res,next)=>{
    res.json({message:"the url is incorrect"})
});
server.use((err,req,res,next)=>{
    res.status(err.statusCode );  //==> the defult status code is 500 (Internal Server Error) 

    res.json({
        message:
        err.message
    });
});

server.listen(3000,()=>{
    console.log('server running')
});