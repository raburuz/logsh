import { redirect } from 'next/navigation'
import { Onboarding } from '@/modules/onboarding/components/onboarding';
import { seo } from '@/modules/shared/utils/seo';
import { getServerSideUser } from '@/modules/shared/lib/auth/middlewares/user';

export const metadata =  seo({
  title: "logsh.co - Onboarding",
  description: "Welcome to logsh.co! Let's get you set up with our onboarding process to start experiencing real-time visibility and alerts for your apps. Follow the steps to get started with One Day.",
})

export default async function Page() {

  const user = await getServerSideUser();
  if(!user) return redirect('/')

  return (
    <Onboarding/>
  )
}
