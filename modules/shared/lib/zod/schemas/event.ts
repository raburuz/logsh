import z from "zod";
import * as emoji from "node-emoji";
import { workspaceValidator } from "@/modules/feed/lib/zod";

export const eventApiCreationSchema = z.strictObject({
    event: z
      .string({ error: "Event must be a string" })
      .trim()
      .min(1, "Event is required")
      .max(150, "Event must be 150 characters or less"),
    description: z
      .string({ error: "Description must be a string" })
      .trim()
      .min(1, "Description can not be a empty string")
      .max(250, "Description must be 250 characters or less")
      .optional()
      .default(""),
    //https://www.npmjs.com/package/node-emoji
    icon: z
      .string({ error: "Icon must be a valid emoji 🔥" })
      .trim()
      .optional()
      .default("🔥") 
      .refine((val) => {
        const result = emoji.find(val);
        return !!result
      }, {
        message: "Icon must be a valid emoji 🔥",
      }),
    workspace: workspaceValidator.name,
    notify: z
      .boolean({ error: "Notify must be a boolean value" })
      .optional()
      .default(false),
    metadata: z.record(
      z.string({ error: "Key must be a string" })
        .min(1, "Key cannot be empty")
        .max(100, "Key must be 100 characters or less"), 
      z.union(
        [
        z
          .string({ error: "Value must be a string" })
          .max(500, "Value must be 500 characters or less"), 
        z
          .number({ error: "Value must be a number" }), 
        z
          .boolean({ error: "Value must be a boolean" })
      ], {
        error: 'Metadata value must be string, number or boolean'
      })
    )
    .optional()
    .default({})
  }, { 
    error: ( value ) => {

      if(value.code === 'unrecognized_keys'){
        return { message: `Invalid ${JSON.stringify(value.keys)} keys in request body` } 
      }
    
      return { message: "Invalid request body", details: value.errors }

    } 
  });