import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const faqData: { question: string; answer: string }[] = [
  // general questions
  {
    question: "What is Logsh?",
    answer: "Logsh is a platform that provides real-time visibility and alerts for your apps, scripts, cron jobs, services, infrastructure, and more."
  },
  {
    question: "How does Logsh work?",
    answer: "Logsh collects logs and events from your applications and infrastructure, processes them in real-time, and provides insights and alerts based on the data."
  },
  {
    question: "What types of applications can I monitor with Logsh?",
    answer: "You can monitor a wide range of applications, including web applications, microservices, cronjobs, and any other services that generate logs and events."
  },
  {
    question: "Can I send logs from any programming language?",
    answer: "Yes, Logsh accepts logs from any language that can send events via HTTP."
  },

  // getting started
  {
    question: "Is Logsh easy to set up?",
    answer: "Yes, Logsh is designed to be easy to set up. You can get started in just a few minutes by following our simple onboarding process."
  },

  // alerts and monitoring
  {
    question: "What kind of alerts can I set up with Logsh?",
    answer: "You can set up custom alerts based on specific log patterns, thresholds, or events. Logsh will notify you in real-time when an alert is triggered."
  },
  {
    question: "What happens if I get more events than my plan allows?",
    answer: "No worries! We'll continue tracking your events, but you'll need to upgrade to a larger plan to access your dashboard."
  },

  // plans and pricing
  {
    question: "Can I use Logsh for free?",
    answer: "Unfornately, Logsh does not offer a free tier. However, we do offer a 14-day free trial for new users to explore the platform and its features."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, Logsh offers a 14-day free trial for new users."
  },
  {
    question: "How do I upgrade my plan?",
    answer: "You can upgrade your plan from your account settings. Just select the plan that best fits your needs and follow the prompts."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time from your account settings."
  },
  {
    question: "Do you offer discounts?",
    answer: "Yes, we offer a 2-month free discount for annual billing. Choose the annual billing option when selecting your plan to take advantage of this offer."
  },

  // support and compliance
  {
    question: "What kind of support does Logsh offer?",
    answer: "We provide support via chat, email, and comprehensive documentation. Premium plans include priority assistance."
  },
  {
    question: "Does Logsh comply with regulations like GDPR?",
    answer: "Yes, Logsh complies with international privacy and security standards, including GDPR."
  },

  // Future features and roadmap
   {
    question: "What new features are coming to Logsh?",
    answer: "We regularly work on improving Logsh, including new dashboard features, integrations, and alert types. Stay tuned to our announcements for upcoming features."
  },
  {
    question: "Can I suggest a feature for Logsh?",
    answer: "Absolutely! We welcome user suggestions through our feedback portal. Your ideas help shape our roadmap."
  },
  {
    question: "How often does Logsh release updates?",
    answer: "We release updates regularly, with bug fixes, performance improvements, and new features to keep your experience smooth."
  },
];

export const Faq = () => {
  return (
    <div className="mb-10 w-full mx-auto max-w-2xl">
      <Accordion type="single" collapsible className="space-y-4" >
        {
          faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-0">
              <AccordionTrigger
                className="border border-zinc-900/30 bg-zinc-900/10 px-4"
              >{item.question}</AccordionTrigger>
              <AccordionContent
                className="px-4 mt-4 border-b border-zinc-900/30"
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        }
      </Accordion>
    
    </div>
  )
}
