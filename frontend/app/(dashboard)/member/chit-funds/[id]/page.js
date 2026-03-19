"use client";
import { useParams } from "next/navigation";
import ChitFundDetailView from "@/components/views/member-portal/ChitFundDetailView";
export default function Page() {
  const { id } = useParams();
  return <ChitFundDetailView schemeId={id} />;
}
