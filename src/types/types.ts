import { JwtPayload } from "jsonwebtoken";

export type AuthUser = JwtPayload | string | { id: string; email: string };
