const prisma = require("./db").getInstance();

const {Request, Response, NextFunction} = require("express");

class AuthMiddleware {
    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static authRequired(req, res, next) {
        if (req.is_authenticated == false) {
            res.status(401).json({ error: "Unauthorized" });
        }else{
            next();
        }
    }

    /**
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    static async resolveUser(req, res, next) {
        if (!req.headers.username) {
            req.is_authenticated = false;
            req.user = null;
        }else{
            req.is_authenticated = true;
            req.user = await prisma.user.findFirst({
                where: {
                    username: req.headers.username
                },
                select: {
                    id: true,
                    username: true,
                    mobileno: true,
                    emailid: true
                }
            })
            if(req.user == null) req.is_authenticated = false;
        }
        next();
    }
}

module.exports = {AuthMiddleware};