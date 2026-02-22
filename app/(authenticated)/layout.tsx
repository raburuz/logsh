import { redirect } from "next/navigation";
import { AppProvider } from "@/modules/shared/components/provider";
import { seo } from "@/modules/shared/utils/seo";
import { getServerSideUser } from "@/modules/shared/lib/auth/middlewares/user";
import { Feedback } from "@/modules/shared/components/feedback";

export const metadata = seo({
  title: "logsh.co - Dashboard",
  description: "Access your logsh.co dashboard to get real-time visibility and alerts for your apps. Manage your account, view logs, and stay informed with One Day.",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getServerSideUser();

  if(!user) {
    return redirect('/auth');
  }

  return (
    <>
      <Feedback/>
      <AppProvider>
        {children}
      </AppProvider>
    </>
  );
}
