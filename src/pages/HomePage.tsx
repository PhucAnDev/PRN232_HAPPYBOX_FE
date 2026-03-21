import { BestSellers } from "@/components/sections/BestSellers";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { CorporateSection } from "@/components/sections/CorporateSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ValueProposition } from "@/components/sections/ValueProposition";

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <HeroSection />
      <ValueProposition />
      <CorporateSection onNavigate={onNavigate} />
      <CategoryGrid />
      <BestSellers onAddToCart={() => {}} />
    </>
  );
}
