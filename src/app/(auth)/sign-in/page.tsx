"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  //* Here AuthProvider was needed for session as we need to use SessionProvider which is inside /context/AuthProvider.tsx (this is vvimp!)
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="bg-orange-500 p-3 px-3 py-1 m-4 rounded"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
