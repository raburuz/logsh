import { redirect } from "next/navigation";
import { DashboardProvider } from "@/modules/shared/components/provider";
import { getServerSideUser } from "@/modules/shared/lib/auth/middlewares/user";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getServerSideUser();

  // # Redirect Onboarding
  if(!user?.isOnboarded) {
    return redirect('/onboarding');
  }

  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
