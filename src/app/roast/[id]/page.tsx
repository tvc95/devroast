import type { Metadata } from "next";
import { RoastResultClient } from "@/components/roast/roast-result-client";

export const metadata: Metadata = {
  title: "Roast Result | DevRoast",
  description: "Your code roast result",
};

export default async function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoastResultClient id={id} />;
}
