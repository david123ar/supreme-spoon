import React from "react";
import Nav from "@/app/Nav/Nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Navic({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Nav session={session} children={children} />
    </div>
  );
}
