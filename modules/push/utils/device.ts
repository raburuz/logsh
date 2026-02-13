import z from "zod"

export const generateDeviceId = () => {
  return crypto.randomUUID();
}

export const deviceIdZodSchema = z
.uuid();