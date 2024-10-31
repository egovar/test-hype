"use client";
import { MintDialog } from "@/components/mintDialog";
import { WalletButton } from "@/components/walletButton";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey } = useWallet();
  return (
    <div className="h-screen flex items-center justify-center gap-4">
      <WalletButton className="w-[200px]" />
      {publicKey && <MintDialog className="w-[200px]" />}
    </div>
  );
}
