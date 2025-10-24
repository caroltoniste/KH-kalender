import { z } from "zod";

export const postSchema = z.object({
  title: z.string().optional(),
  type: z.enum([
    "donation",
    "video",
    "event",
    "adoption",
    "news",
    "lottery",
    "collaboration",
    "update",
    "other",
  ]),
  datetime: z.string(),
  time: z.string(),
  owner: z.string().optional(),
  channels: z.array(z.enum(["tiktok", "facebook", "instagram"])),
  notes: z.string().optional(),
  copy: z.string().optional(),
  materials: z.string().optional(),
});

export type PostSchemaType = z.infer<typeof postSchema>;
