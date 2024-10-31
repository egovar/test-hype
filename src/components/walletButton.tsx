"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { WalletName } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export const WalletButton = ({ className }: { className?: string }) => {
  const { publicKey } = useWallet();
  return publicKey ? (
    <DisconnectWalletButton className={className} />
  ) : (
    <ConnectWalletButton className={className} />
  );
};

const ConnectWalletButton = ({ className }: { className?: string }) => {
  const { wallets, select } = useWallet();
  const userWallets = useMemo(() => {
    return wallets.map((w) => w.adapter.name);
  }, [wallets]);
  const appWallets: WalletName[] = [
    "Phantom" as WalletName,
    "Solflare" as WalletName,
  ];
  async function connectWallet(walletName: WalletName) {
    select(walletName);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className}>Connect wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Connect wallet</DialogTitle>
        <div className="flex gap-2">
          {appWallets.map((w) => (
            <Button
              key={w}
              onClick={() => connectWallet(w)}
              disabled={!userWallets.includes(w)}
            >
              {w}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DisconnectWalletButton = ({ className }: { className?: string }) => {
  const { disconnect, publicKey } = useWallet();
  return (
    <div className={cn(className, "relative")}>
      <Button onClick={disconnect} className="w-full">
        Disconnect
      </Button>
      <p className="absolute">{publicKey?.toString()}</p>
    </div>
  );
};
