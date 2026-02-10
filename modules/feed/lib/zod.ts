import z from "zod";

export const workspaceValidator = {

  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(35,"Workspace name must be 35 characters or fewer")
    .toLowerCase(),

}