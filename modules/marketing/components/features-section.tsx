import { Scan, Bell, Brain, MessageSquare, Phone, Settings, MonitorSmartphone } from "lucide-react"

const features = [
  {
    icon: Scan,
    title: "One app for all your monitoring needs",
    description: "Monitor websites, servers, databases, and more from a single platform.",
    color: "text-emerald-400",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Get instant notifications as soon as new events are detected.",
    color: "text-emerald-400",
  },
  {
    icon: Settings,
    title: "Easy configuration",
    description: "Simple setup to monitor all your applications.",
    color: "text-emerald-400",
  },
  {
    icon: MonitorSmartphone,
    title: "Accessible Anywhere",
    description: "Access your monitoring workspace from any device, anytime.",
    color: "text-emerald-400",
  },
]

export function FeaturesSection() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="space-y-6">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-4">
            <div className={`${feature.color} mt-1`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-1">{feature.title}</h4>
              <p className="text-white/80 text-xs leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
