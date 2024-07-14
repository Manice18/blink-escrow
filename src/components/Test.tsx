"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { createEscrowFormSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEscrow } from "@/hooks/useEscrow";
import { Button } from "./ui/button";

type CreateEscrowFormSchemaType = z.infer<typeof createEscrowFormSchema>;

const Test = () => {
  const { publicKey } = useWallet();
  const { makeEscrow, refundEscrow, getAllEscrowAccounts } = useEscrow();
  const form = useForm<CreateEscrowFormSchemaType>({
    resolver: zodResolver(createEscrowFormSchema),
    defaultValues: {
      tokenMintTradeAddr: "",
      tokenMintReceiveAddr: "",
      tokenMintTradeAmount: 0,
      tokenMintReceiveAmount: 0,
    },
  });
  async function onSubmit(values: z.infer<typeof createEscrowFormSchema>) {
    console.log(values);

    await makeEscrow({
      mintA: values.tokenMintTradeAddr,
      mintB: values.tokenMintReceiveAddr,
      deposit: values.tokenMintTradeAmount,
      receive: values.tokenMintReceiveAmount,
    });

    toast.success("Escrow created successfully");
  }

  async function handleRefundEscrow() {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }
    await refundEscrow(
      new PublicKey("2Ujc7V5vdjuUQVaUMvLof9dMdqD3Sq8pfJJrFfQNQqu6"),
    );
    toast.success("Escrow refunded successfully");
  }

  return (
    <div className="flex flex-col space-y-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-w-[500px] flex-col space-y-4 p-4"
        >
          <FormField
            control={form.control}
            name="tokenMintTradeAddr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-black dark:text-white">
                  Trade Token
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. Dic2Ci9AfyNFJcQCZQb7YJnT8LAPkLA9MJwsQqz4idC3"
                    {...field}
                    className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                  />
                </FormControl>
                <FormDescription>
                  The mint address of the token you want to trade
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenMintReceiveAddr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-black dark:text-white">
                  Receive Token
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. EJ1Xr9jhYGZsPZMbgPuKfp44uRdHLSrppj9xdPN8xAdW"
                    {...field}
                    className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                  />
                </FormControl>
                <FormDescription>
                  The mint address of the token you want to receive
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenMintTradeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-black dark:text-white">
                  Amount of tokens to trade
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 5"
                    {...field}
                    className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                  />
                </FormControl>
                <FormDescription>
                  The number of tokens you want to trade
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tokenMintReceiveAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-black">
                  Amount of tokens to receive
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. 5"
                    {...field}
                    className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                  />
                </FormControl>
                <FormDescription>
                  The number of tokens you want to receive
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
            type="submit"
          >
            <span>Continue</span>
            <MoveRight size={20} />
          </Button>
        </form>
      </Form>
      <div>
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          onClick={getAllEscrowAccounts}
        >
          <span>Get All Escrow Accounts</span>
        </Button>
      </div>
      <div>
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          onClick={handleRefundEscrow}
        >
          <span>Refund Escrow</span>
        </Button>
      </div>
    </div>
  );
};

export default Test;
