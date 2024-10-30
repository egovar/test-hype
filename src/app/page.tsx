"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

export default function Home() {
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false },
  );
  const WalletDisconnectButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
    { ssr: false },
  );
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-600">
      <WalletMultiButton />
      <WalletDisconnectButton />
      <Button>Mint</Button>
    </div>
  );
}
