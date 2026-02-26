import { eq } from "drizzle-orm"
import { db } from "../db"
import { user } from "../schemas/auth"

export const userQuery = {
  find_by_stripe_customer_id : async (stripeCustomerId: string) => {

    const response = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      stripeCustomerId: user.stripeCustomerId,
    })
    .from(user)
    .where(
      eq(user.stripeCustomerId, stripeCustomerId)
    )

    return response.at(0);

  }
}