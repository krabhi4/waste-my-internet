import { HydrateClient } from "@/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        Hello
      </main>
    </HydrateClient>
  );
}
