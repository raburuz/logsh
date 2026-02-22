import { getServerSideUser } from "@/modules/shared/lib/auth/middlewares/user";


export const Profile = async () => {

  const user = await getServerSideUser();

  return (
    <section className="flex flex-col gap-4 pb-10">
      <h1 className="font-bold text-lg">Account</h1>
      <div className="space-y-1 text-xs">
        <h3 className="font-medium">Name</h3>
        <p className="text-zinc-500">{user?.name}</p>
      </div>
      <div className="space-y-1 text-xs">
        <h3 className="font-medium">Email</h3>
        <p className="text-zinc-500">{user?.email}</p>
      </div>
    </section>
  )
}
