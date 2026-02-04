import { getServerSideUser } from "../actions/auth"

export const Profile = async () => {

  const user = await getServerSideUser();

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-white font-bold text-2xl">Profile</h1>
      <div>
        <span className="font-bold text-lg">Name</span>
        <p className="text-white/50">{user?.name}</p>
      </div>
      <div>
        <span className="font-bold text-lg">Email</span>
        <p className="text-white/50">{user?.email}</p>
      </div>

    </div>
  )
}
