import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Manifesto from "@/components/Manifesto";
import Releases from "@/components/Releases";
import Roster from "@/components/Roster";
import Offer from "@/components/Offer";
import Proof from "@/components/Proof";
import Apply from "@/components/Apply";
import Footer from "@/components/Footer";
import { site } from "@/lib/content";

/**
 * Structured data so Google can render the label as an organisation and
 * surface the contact address in search.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: site.name,
  description:
    "An independent record label for singers, composers and producers building the next era of Indian music.",
  email: site.email,
  genre: ["Indian Classical", "Indie", "Fusion", "Film Music"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div id="top" />
      <Nav />

      <main id="main">
        {/* The scroll narrative:
            hook → texture → belief → proof of work → people →
            what's in it for you → credibility → ask */}
        <Hero />
        <Ticker />
        <Manifesto />
        <Releases />
        <Roster />
        <Offer />
        <Proof />
        <Apply />
      </main>

      <Footer />
    </>
  );
}
