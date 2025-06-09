// src/app/page.tsx
import { TxList } from "@/components/TxList";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">📜 Transaction Viewer</h1>
      <TxList />
    </main>
  );
}
