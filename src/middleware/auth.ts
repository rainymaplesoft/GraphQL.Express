import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { __secretKey } from "../env/env";

export const authHandler: RequestHandler = (req, res, next) => {
    const notAuth = () => {
        req.body.isAuth = false;
        return next();
    }
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return notAuth();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        return notAuth();
    }

    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, __secretKey);
    } catch (err) {
        return next();
    }
    if (!decodedToken || !decodedToken['userId']) {
        return next();
    }
    req.body.isAuth = true;
    req.body.userId = decodedToken.userId;
    next();
}
