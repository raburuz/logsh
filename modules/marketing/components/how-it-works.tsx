import { WorkspaceCard } from "./workspace-card"
import { KeywordMarquee } from "./keyword-marquee"
import { FeaturesSection } from "./features-section"
import { ChatPreview } from "./chat-preview"

export const HowItWorks = () => {
  return (
    <section className="relative py-20 mb-20 w-full bg-black/50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        {/* Badge */}
        <div className="flex justify-center mb-2">
          <span className="px-4 py-1.5 text-sm text-green-600 border border-green-800 rounded-full">
            How It Works
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-medium text-white text-center mb-4">
          Monitor Your Applications Seamlessly
        </h2>
        <h2 className="text-3xl md:text-4xl font-medium text-green-400 text-center mb-16">
          3 Simple Steps
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="h-36 ">
            <div className="w-px h-full bg-linear-to-b from-transparent to-green-500 mx-auto" />
          </div>

          {/* Step 1 */}
          <div className="relative mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center z-10">
                <span className="text-green-500 text-sm">1</span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-white text-center mb-2">
              Create a workspace
            </h3>
            <p className="text-white/80 text-sm text-center max-w-sm mx-auto mb-8">
              Set up a dedicated workspace for your application monitoring needs.
            </p>
            <WorkspaceCard />
          </div>

          <div className="h-36 ">
            <div className="w-px h-full bg-linear-to-b from-transparent to-green-500 mx-auto" />
          </div>
          {/* Step 2 */}
          <div className="relative mb-16">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center z-10">
                <span className="text-green-500 text-sm">2</span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-white text-center mb-2">
              Integrate
            </h3>
            <p className="text-white/80 text-sm text-center max-w-sm mx-auto mb-8">
              One simple HTTP request to start monitoring your applications.
            </p>
          </div>
        </div>
      </div>

      {/* Keyword Marquee - Full Width */}
      <KeywordMarquee />

      <div className="h-36 ">
        <div className="w-px h-full bg-linear-to-b from-transparent to-green-500 mx-auto" />
      </div>
      {/* Step 3 */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center z-10">
              <span className="text-green-500 text-sm">3</span>
            </div>
          </div>
          <h3 className="text-xl font-medium text-white text-center mb-2">
            Get real-time insights
          </h3>
          <p className="text-white/80 text-sm text-center max-w-sm mx-auto mb-12">
            Receive instant feedback from your applications in real-time through your phone or desktop.
          </p>

          {/* Features and Chat Preview */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <FeaturesSection />
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
