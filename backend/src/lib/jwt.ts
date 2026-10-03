import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const createToken = (payload: {
    id: number,
    role: string,
    // sessionId: string
}) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
}