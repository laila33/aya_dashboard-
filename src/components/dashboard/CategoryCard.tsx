import { Card } from "@/components/ui/Card";

type CategoryCardProps = {
  name: string;
  emoji: string;
};

export function CategoryCard({ name, emoji }: CategoryCardProps) {
  return (
    <Card className="w-[130px] shrink-0 rounded-2xl border-[#f3d2dc] bg-white p-3 text-center shadow-[0_4px_14px_rgba(235,139,168,0.12)]">
      <div className="mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#fff0f5] text-4xl">
        {emoji}
      </div>
      <h3 className="mt-2.5 text-sm font-semibold text-[#3d2730] leading-snug">{name}</h3>
    </Card>
  );
}
