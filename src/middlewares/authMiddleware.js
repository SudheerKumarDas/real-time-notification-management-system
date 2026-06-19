import jwt from "jsonwebtoken"

const verifyJWT = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            message:"token not provided"
        })
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.ACCESS_SECRET,
        (err,decoded) => {
            if(err){
                return res.sendStatus(403);
            }
            req.id=decoded.id;
            next();
        }
    )
}