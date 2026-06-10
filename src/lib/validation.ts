import { z } from "zod";

export const attributionSchema = z
  .object({
    utmSource: z.string().max(200).optional(),
    utmMedium: z.string().max(200).optional(),
    utmCampaign: z.string().max(200).optional(),
    referrer: z.string().max(500).optional(),
    landingPage: z.string().max(500).optional(),
  })
  .optional();

export const optionalUrl = z.string().url().optional().or(z.literal(""));
