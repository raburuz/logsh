import z from "zod";

export const feedBackSchema = z.object({
  content: z.string()
    .min(1, "Feedback content is required")
    .max(1500, "Feedback content must be less than 1500 characters"),
})

export type FeedBackSchema = z.infer<typeof feedBackSchema>;