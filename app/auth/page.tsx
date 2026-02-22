import { AuthForm } from "@/modules/auth/components/form";
import { seo } from "@/modules/shared/utils/seo";

export const metadata = seo({
  title: "logsh.co - Login or Sign Up",
  description: "Access your logsh.co account or create a new one to get real-time visibility and alerts for your apps. Log in or sign up now to experience the power of One Day.",
}) 

export default function Page() {
  return (
    <>
      <div className="max-w-4xl h-screen mx-auto p-4 grid place-content-center">
        <AuthForm/>
      </div>
    
    </>
  )
}