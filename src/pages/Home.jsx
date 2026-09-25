import Constellation from '../innovations/Constellation'
import ReadinessCheck from '../innovations/ReadinessCheck'
import Preview from '../components/Preview'
import { Hero, Mission, About, Features, HowItWorks, Guide, Impact, Partners, Stories, CTA } from '../components/Sections'
import { useMeta } from '../lib/meta'

export default function Home() {
  useMeta("Eblood | Pakistan's Blood Donation App", "Pakistan's first AI-powered blood donation app. Connecting donors and patients instantly through smart, location-based technology.")
  return (
    <main id="main">
      <Hero />
      <Mission />
      <About />
      <Features />
      <Constellation />
      <HowItWorks />
      <Guide />
      <ReadinessCheck />
      <Impact />
      <Preview />
      <Partners />
      <Stories />
      <CTA />
    </main>
  )
}
