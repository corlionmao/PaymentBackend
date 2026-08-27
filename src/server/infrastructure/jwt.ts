import { SignJWT, jwtVerify } from "jose";
import { UnauthorizedError } from "../domain/errors";

const JWT_KEY = "PaymentSystemJwtSigningKey32chrs";
const secret = new TextEncoder().encode(JWT_KEY);
const ISSUER = "PaymentSystem";
const AUDIENCE = "PaymentSystem";

export async function generateToken(username: string) {
  return new SignJWT({ unique_name: username })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
}

export async function verifyBearer(header: string | null) {
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing Bearer token.");
  }
  const token = header.slice("Bearer ".length).trim();
  try {
    await jwtVerify(token, secret, { issuer: ISSUER, audience: AUDIENCE });
  } catch {
    throw new UnauthorizedError("Invalid or expired token.");
  }
}
