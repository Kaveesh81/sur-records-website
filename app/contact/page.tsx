import type { Metadata } from "next";
import Apply from "@/components/Apply";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sur Records, or apply to be part of the label.",
};

export default function ContactPage() {
  return <Apply />;
}
