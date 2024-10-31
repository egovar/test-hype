import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as sdk from "@/lib/sdk";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const PUBLIC_VERSION = 4;
const PROGRAM_ID_STRING = "8QodS2B2WD9DvHHqNeMoLiYkVmusE9rX1ZG4ZhrLfJfh";
const PROGRAM_ID = new PublicKey(PROGRAM_ID_STRING);
const NETWORK_ID = 0;

const formSchema = z
  .object({
    account: z
      .string({
        required_error: "Account name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(4, { message: "At least 4 symbols" })
      .max(20, { message: "No more than 20 symbols" }),
    amount: z.coerce
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must me an integer",
      })
      .int({ message: "Amount must me an integer" })
      .min(1, { message: "Mint at least 1 token" })
      .max(1000, "Maximum mint amount is 1000"),
  })
  .required();

export const MintDialog = ({ className }: { className?: string }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      amount: 1,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const root = new sdk.RootAccount();
    const rootAccount = sdk.findRootAccountAddress(PROGRAM_ID, PUBLIC_VERSION);
    const rootAccountInfo = await connection.getAccountInfo(rootAccount);
    if (!rootAccountInfo?.data) {
      toast({
        title: "No root account info",
        variant: "destructive",
      });
      return;
    }
    root.update(rootAccountInfo.data);
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        variant: "destructive",
      });
      return;
    }
    const mintConfig = await sdk.mint({
      connection,
      root,
      rootAccount,
      wallet: publicKey,
      networkId: NETWORK_ID,
      programId: PROGRAM_ID,
      address: values.account,
      amount: values.amount,
    });
    const txn = new Transaction();
    txn.instructions = [mintConfig.instruction];
    try {
      const hash = await sendTransaction(txn, connection);
      if (!hash) return;
      setOpen(false);
      console.log(
        `View on explorer: https://explorer.solana.com/tx/${hash}?cluster=devnet`,
      );
      toast({
        title: "Minted successfully",
        description: "To view transaction info, open console",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Probably there is no such token on Hype",
        variant: "destructive",
      });
    }
  }
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(newVal) => setOpen(newVal)}>
      <DialogTrigger asChild>
        <Button className={className}>Mint</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mint hype tokens</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Account tag</FormLabel>
                  <FormControl>
                    <Input placeholder="durov" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Token mint amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Mint tokens</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
