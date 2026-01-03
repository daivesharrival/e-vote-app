import { z } from "zod"

export const votingSchema = z.object({
  candidateNameEn: z.string().min(3),
  candidateNameMr: z.string().min(3),

  partyNameEn: z.string().min(2),
  partyNameMr: z.string().min(2),

  symbolNameEn: z.string().min(2),
  symbolNameMr: z.string().min(2),

  electionType: z.string().min(1),
  electionName: z.string().min(5),

  votingDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),

  // Coerce the input to a number (accepts string or number) and validate
  candidateNumber: z.coerce.number().int().positive(),
})

export type VotingFormType = z.infer<typeof votingSchema>
