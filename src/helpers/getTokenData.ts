import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getTokenData = (request: NextRequest): string | undefined => {
  try {
    // Retrieve the token from cookies
    const token = request.cookies.get("token")?.value || "";

    // Verify the token and decode it
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    // Return the user ID if available
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
