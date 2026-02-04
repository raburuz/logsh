import { PhoneMockup, WindowMockup } from "./mockup"

export function ChatPreview() {
  const messages = [
    {
      platform: "User Feedback was submitted",
      time: "Right now",
      content: "Loving the new features in the latest update! The UI is so much cleaner and easier to navigate.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-l-orange-500",
    },
    {
      platform: "System Alert",
      time: "1min ago",
      content: "High memory usage detected on Server-3. Current usage is at 92%.",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-l-red-500",
    },
    {
      platform: "Cron Job Completed",
      time: "30min ago",
      content: "The nightly data backup has completed successfully without any errors.",
      color: "text-zinc-500",
      bgColor: "bg-zinc-500/10",
      borderColor: "border-l-zinc-500",
    },
    {
      platform: "New Feature Request",
      time: "1hrs ago",
      content: "It would be great to have a dark mode option for the dashboard to reduce eye strain during late-night monitoring.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-l-emerald-500",
      isHighlighted: true,
    },
    {
      platform: "Stripe Payment Successful",
      time: "1hrs ago",
      content: "Payment of $49.99 for the Pro Plan has been processed successfully.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-l-blue-500",
      isHighlighted: true,
    },
  ]

  return (
    <div className="max-h-80">
      <PhoneMockup>
        <div className="relative">
          {/* Messages */}
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${message.bgColor} ${message.borderColor} border-l-2 rounded-r-md p-3`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${message.color}`}>
                    {message.platform}
                  </span>
                  <span className="text-white/80 text-[10px]">{message.time}</span>
                </div>
                <p className="text-white/80 text-[10px] leading-relaxed">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </PhoneMockup>
    </div>
  )
}
