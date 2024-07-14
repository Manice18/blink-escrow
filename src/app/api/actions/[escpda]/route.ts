import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import { Program, web3 } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import idl from "@/lib/solana/idl.json";
import { AnchorEscrow } from "@/types/anchor_escrow";

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const program = new Program<AnchorEscrow>(idl as AnchorEscrow, {
  connection,
});

const isToken2022 = async (mint: PublicKey) => {
  const mintInfo = await connection.getAccountInfo(mint);
  return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
};

export const GET = async (
  req: Request,
  { params }: { params: { escpda: string } },
) => {
  if (!params.escpda) {
    return new Response("Invalid Escrow PDA", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const escrow = new web3.PublicKey(params.escpda);

  try {
    const requestUrl = new URL(req.url);

    const escrowAccount = await program.account.escrow.fetch(escrow);

    const baseHref = new URL(
      `/api/actions/${escrow.toString()}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      title: "Take Escrow",
      icon: "https://res.cloudinary.com/dftafieg2/image/upload/v1720996591/x2wm3wusp9bnbtimhubn.png",
      description: `Take the escrow with token mint ${escrowAccount.mintA.toString()} by giving ${escrowAccount.mintB.toString()} of  ${escrowAccount.receive.toString()}`,
      label: "Taker",
      links: {
        actions: [
          {
            label: "Take Escrow",
            href: `${baseHref}`,
          },
        ],
      },
    };
    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const OPTIONS = GET;

export const POST = async (
  req: Request,
  { params }: { params: { escpda: string } },
) => {
  try {
    const requestUrl = new URL(req.url);

    const body: ActionPostRequest = await req.json();
    const { account } = body;

    const authority = new web3.PublicKey(account);
    const escrow = new web3.PublicKey(params.escpda);
    const escrowAccount = await program.account.escrow.fetch(escrow);
    const tokenProgram = (await isToken2022(escrowAccount.mintA))
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;
    const vault = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintA),
      escrow,
      true,
      tokenProgram,
    );
    const makerAtaB = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintB),
      escrowAccount.maker,
      false,
      tokenProgram,
    );

    const takerAtaA = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintA),
      authority,
      false,
      tokenProgram,
    );

    const takerAtaB = getAssociatedTokenAddressSync(
      new PublicKey(escrowAccount.mintB),
      authority,
      false,
      tokenProgram,
    );

    const ix = await program.methods
      .take()
      .accountsPartial({
        maker: escrowAccount.maker,
        taker: authority,
        mintA: new PublicKey(escrowAccount.mintA),
        mintB: new PublicKey(escrowAccount.mintB),
        makerAtaB,
        takerAtaA,
        takerAtaB,
        escrow,
        tokenProgram,
        vault,
      })
      .instruction();
    const blockhash = await connection
      .getLatestBlockhash({ commitment: "max" })
      .then((res) => res.blockhash);
    const messageV0 = new web3.TransactionMessage({
      payerKey: authority,
      recentBlockhash: blockhash,
      instructions: [ix],
    }).compileToV0Message();
    const transaction = new web3.VersionedTransaction(messageV0);

    const payload: ActionPostResponse = {
      transaction: Buffer.from(transaction.serialize()).toString("base64"),
      message: `Take escrow successfully`,
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
