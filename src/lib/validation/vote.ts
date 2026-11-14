import { z } from "zod";

export const castVoteSchema = z.object({
  contestSlug: z.string().trim().min(1, "Contest slug is required.").max(100),
  entryCode: z.string().trim().min(1, "Entry code is required.").max(100),
});

export type CastVoteInput = z.infer<typeof castVoteSchema>;

