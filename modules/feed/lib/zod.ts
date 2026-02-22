import z from "zod";

export const workspaceValidator = {

  name: z.string({ error: "Workspace name must be a string" })
    .trim()
    .min(1, "Workspace name is required")
    .max(35,"Workspace name must be 35 characters or fewer")
    .toLowerCase(),

}