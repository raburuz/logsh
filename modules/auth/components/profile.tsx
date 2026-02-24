import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getServerSideUser } from "@/modules/shared/lib/auth/middlewares/user";

export const Profile = async () => {

  const user = await getServerSideUser();

  return (
    <Card className="flex flex-col gap-4 pb-10">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account details and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-px w-full bg-zinc-900/30"></div>
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Name</h3>
            <p className="text-zinc-500 text-xs">{user?.name}</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Email</h3>
            <p className="text-zinc-500 text-xs">{user?.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
