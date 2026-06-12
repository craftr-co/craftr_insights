import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { getAuthOptions } from "@/lib/auth";

const handler = (request: NextRequest, context: { params: { nextauth: string[] } }) =>
  NextAuth(request, context, getAuthOptions(request));

export { handler as GET, handler as POST };
