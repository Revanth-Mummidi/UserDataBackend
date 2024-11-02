// const asyncHandler = require("express-async-handler");
// const jwt = require("jsonwebtoken");

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = asyncHandler(async(req,res,next)=>{
    let token;
    let authHeader = (req.headers.Authorization || req.headers.authorization);
    if(authHeader)
    {
      if(authHeader.startsWith("Bearer"))
      token = authHeader.split(" ")[1];
      else
      token=authHeader

      jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err)
        {
            console.log("TOKEN=",token,err)
            res.status(401);
            throw new Error("User is not authorized");
        }
        req.email=decoded.email;
        next();
      })
    }
    else{
        res.status(401);
        throw new Error("Authtoken is not present");
    }
})

export default validateToken;