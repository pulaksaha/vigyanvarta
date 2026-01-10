import { Category } from '@/data/mockArticles';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const categoryColors: Record<Category, string> = {
  science: 'bg-category-science',
  technology: 'bg-category-technology',
  innovation: 'bg-category-innovation',
  research: 'bg-category-research',
  gadgets: 'bg-category-gadgets',
  space: 'bg-category-space',
};

const CategoryBadge = ({ category, size = 'md' }: CategoryBadgeProps) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-block ${categoryColors[category]} text-white font-medium uppercase tracking-wider ${sizeClasses}`}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;