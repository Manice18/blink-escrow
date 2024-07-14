import { z } from "zod";

const createEscrowFormSchema = z.object({
  tokenMintTradeAddr: z.string().trim().min(1, "Cannot be empty"),
  tokenMintReceiveAddr: z.string().trim().min(1, "Cannot be empty"),
  tokenMintTradeAmount: z.coerce
    .number()
    .gte(1, "Value must be greater than 0"),
  tokenMintReceiveAmount: z.coerce
    .number()
    .gte(1, "Value must be greater than 0"),
});

export { createEscrowFormSchema };
