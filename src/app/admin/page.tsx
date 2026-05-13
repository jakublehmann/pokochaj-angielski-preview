import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import type { ContentMap, Offer, OfferExtra, MethodStep, Review, FaqItem } from "@/types/content";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [
    { data: rawContent },
    { data: offers },
    { data: extras },
    { data: steps },
    { data: reviews },
    { data: faqs },
  ] = await Promise.all([
    supabase.from("site_content").select("section, key, value"),
    supabase.from("offers").select("*").order("sort_order"),
    supabase.from("offer_extras").select("*").order("sort_order"),
    supabase.from("method_steps").select("*").order("sort_order"),
    supabase.from("reviews").select("*").order("sort_order"),
    supabase.from("faq_items").select("*").order("sort_order"),
  ]);

  const content: ContentMap = {};
  for (const row of rawContent ?? []) {
    if (!content[row.section]) content[row.section] = {};
    content[row.section][row.key] = row.value;
  }

  return (
    <AdminDashboard
      content={content}
      offers={(offers ?? []) as Offer[]}
      extras={(extras ?? []) as OfferExtra[]}
      steps={(steps ?? []) as MethodStep[]}
      reviews={(reviews ?? []) as Review[]}
      faqs={(faqs ?? []) as FaqItem[]}
    />
  );
}
