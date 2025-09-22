import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: JwtPayload, secretKey: string, expiresIn: string) => {
    const token = jwt.sign(payload, secretKey, { 
        expiresIn
     } as SignOptions);
    return token;
}

export const verifyToken = (token: string, secretKey: string) => {
    const verifiedToken = jwt.verify(token, secretKey);
    return verifiedToken;
}