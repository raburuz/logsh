import { config } from "@/modules/shared/config"
import { X, Check } from "lucide-react"

export const Comparison = () => {
  const withoutFeatures = [
    "😞 Oh no! What happened to my app?!?!?!?!?",
    "😣 Where is the issue? Did my app just crash?",
    "😩 I'm losing money because my app is down!",
    "😕 Can anyone help me fix this issue?",
    "😠 Why is this happening again?!?!",
    "😫 Ugh, another all-nighter to fix this issue.",
    "😤 This is so frustrating!!!",
  ]

  const withFeatures = [
    {
      text: "",
      bold: "Save money and time ",
      rest: "with unified monitoring for all your apps",
    },
    {
      text: "Instantly ",
      bold: "identify and resolve issues within seconds",
      rest: " to minimize downtime",
    },
    {
      text: "",
      bold: "Decrease your operational costs",
      rest: " by consolidating tools into a single platform",
    },
    {
      text: "Real-time alerts and insights with ",
      bold: "instant notifications",
      rest: " to stay informed",
    },
    {
      text: "",
      bold: "Integrate with your favorite tools easily",
      rest: " through a simple HTTP request",
    },
  ]

  return (
    <section className="flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <h2 className="mx-auto text-3xl md:text-4xl max-w-3xl font-bold text-white mb-4 text-balance">
          Why {config.app.name} is Essential <span className="text-green-400">for you</span>r Applications
        </h2>
        <p className="text-[#888] text-base md:text-lg max-w-3xl mx-auto mb-12 text-pretty">
          Save time, reduce costs, and get informed in real-time through {config.app.name}'s unified monitoring platform.
        </p>

        {/* Comparison Cards */}
        <div className="relative grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          <div className="bg-zinc-900/10 rounded-2xl p-6 text-left border border-zinc-900/20">
            <h3 className="text-white font-semibold text-lg mb-6 text-center">
              👎 Without {config.app.name}
            </h3>
            <ul className="space-y-5">
              {withoutFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#888] text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-900/10 rounded-2xl p-6 text-left border border-green-900/50 shadow-md shadow-green-400/10">
            <h3 className="text-white font-semibold text-lg mb-6 text-center">
              👍 With {config.app.name}
            </h3>
            <ul className="space-y-5 md:p-6">
              {withFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#22c55e] mt-0.5 shrink-0" />
                  <span className="text-[#888] text-sm leading-relaxed">
                    {feature.text}
                    <span className="text-white font-semibold">{feature.bold}</span>
                    {feature.rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
