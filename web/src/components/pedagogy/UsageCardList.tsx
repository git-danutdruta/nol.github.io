import type { UsageCardContentBlock } from '@/types/curriculum';
import { UsageCard } from '@/components/pedagogy/UsageCard';

interface UsageCardListProps {
  cards: UsageCardContentBlock[];
}

export function UsageCardList({ cards }: UsageCardListProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section aria-label="Real-world usage cards" className="mb-8">
      {cards.map((card, index) => (
        <UsageCard key={`${card.concept}-${index}`} card={card} />
      ))}
    </section>
  );
}
