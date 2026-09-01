import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import SurilasGrid from "@/components/SurilasGrid";

export const metadata: Metadata = {
  title: "The Surilas",
  description: "Meet the artists of Sur Records — the voices, the songs, the stories.",
};

export default function SurilasPage() {
  return (
    <div className="px-6 pb-28 md:pb-36">
      <PageIntro
        label="The Surilas"
        heading="The voices behind the label"
        sub="Every artist on Sur Records, in one place — their song, their story, their sound."
      />
      <div className="mx-auto max-w-6xl">
        <SurilasGrid />
      </div>
    </div>
  );
}
