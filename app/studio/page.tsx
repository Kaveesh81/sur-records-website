import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import StudioGrid from "@/components/StudioGrid";

export const metadata: Metadata = {
  title: "From the Studio",
  description:
    "Behind the scenes at Sur Records — studio sessions, music videos, and the stories behind the songs.",
};

export default function StudioPage() {
  return (
    <div className="px-6 pb-28 md:pb-36">
      <PageIntro
        label="From the Studio"
        heading="Behind the scenes of the music"
        sub="Studio sessions, music video shoots, and the lyrical journeys behind the songs."
      />
      <div className="mx-auto max-w-6xl">
        <StudioGrid />
      </div>
    </div>
  );
}
