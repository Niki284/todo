

import  jwt  from "jsonwebtoken";
export const jwtAuth = (req,res, next) => {
    const token = req.cookies.token;
    try {
       const user = jwt.verify(token, process.env.TOKEN_SALT);
    req.user = user;
    next(); 
    } catch (e) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
    
}