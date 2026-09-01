import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
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
    "An independent music label for singers, composers and producers building the next era of Indian music.",
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
      <Hero />
      <Manifesto />
    </>
  );
}
