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
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          {/* Header */}
          <h2 className="md:text-3xl text-2xl font-semibold tracking-tight text-zinc-100 text-balance">
            Why {config.app.name} is Essential <br /> <span className="text-green-400">for you</span>r Applications
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Save time, reduce costs, and get informed in real-time through {config.app.name}'s unified monitoring platform.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="relative grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          <div className="bg-zinc-900/10 rounded-2xl p-6 text-left border border-zinc-900/20">
            <h3 className="text-white font-semibold text-lg mb-6 text-center">
              👎 Without {config.app.name}
            </h3>
            <ul className="space-y-5">
              {withoutFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-zinc-500 text-sm leading-relaxed">
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
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-zinc-500 text-sm leading-relaxed">
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
