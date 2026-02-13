import { redirect } from 'next/navigation'
import { getServerSideUser } from '@/modules/auth/actions/auth'
import { Onboarding } from '@/modules/shared/components/onboarding';

export default async function Page() {

  const user = await getServerSideUser();
  if(!user) return redirect('/')

  return (
    <Onboarding/>
  )
}
