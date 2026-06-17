import { createClient } from "@/lib/supabase/server";
import type { ContentMap, Offer, OfferExtra, MethodStep, Review, FaqItem } from "@/types/content";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Method from "@/components/sections/Method";
import OfferSection from "@/components/sections/Offer";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";
import Footer from "@/components/sections/Footer";
import MobileStick from "@/components/sections/MobileStick";
import RevealScript from "@/components/RevealScript";

async function fetchContent(): Promise<{
  content: ContentMap;
  offers: Offer[];
  extras: OfferExtra[];
  steps: MethodStep[];
  reviews: Review[];
  faqs: FaqItem[];
}> {
  try {
    const supabase = await createClient();

    // Guard against an unreachable / paused Supabase project: a hanging
    // connection would otherwise block the whole request until the
    // serverless function times out (504). Fail fast to the fallback.
    const withTimeout = <T,>(p: PromiseLike<T>, ms = 3000): Promise<T> =>
      Promise.race([
        Promise.resolve(p),
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error("supabase timeout")), ms)
        ),
      ]);

    const [
      { data: rawContent },
      { data: offers },
      { data: extras },
      { data: steps },
      { data: reviews },
      { data: faqs },
    ] = await withTimeout(
      Promise.all([
        supabase.from("site_content").select("section, key, value"),
        supabase.from("offers").select("*").order("sort_order"),
        supabase.from("offer_extras").select("*").order("sort_order"),
        supabase.from("method_steps").select("*").order("sort_order"),
        supabase.from("reviews").select("*").order("sort_order"),
        supabase.from("faq_items").select("*").order("sort_order"),
      ])
    );

    const content: ContentMap = {};
    for (const row of rawContent ?? []) {
      if (!content[row.section]) content[row.section] = {};
      content[row.section][row.key] = row.value;
    }

    return {
      content,
      offers: offers ?? [],
      extras: extras ?? [],
      steps: steps ?? [],
      reviews: reviews ?? [],
      faqs: faqs ?? [],
    };
  } catch {
    return { content: {}, offers: [], extras: [], steps: [], reviews: [], faqs: [] };
  }
}

export default async function HomePage() {
  const { content, offers, extras, steps, reviews, faqs } = await fetchContent();

  return (
    <>
      <Nav />
      <div className="page-wrap">
        <main>
          <Hero content={content} />
          <About content={content} />
          <Method content={content} steps={steps} />
          <OfferSection content={content} offers={offers} extras={extras} />
          <Reviews content={content} reviews={reviews} />
          <Faq content={content} faqs={faqs} />
          <Cta content={content} />
        </main>
      </div>
      <Footer content={content} />
      <MobileStick />
      <RevealScript />
    </>
  );
}
