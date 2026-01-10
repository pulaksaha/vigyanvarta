import { Article } from '@/data/mockArticles';
import CategoryBadge from './CategoryBadge';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'horizontal';
}

const ArticleCard = ({ article, variant = 'default' }: ArticleCardProps) => {
  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 py-4 border-b border-border last:border-b-0 cursor-pointer">
        <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <CategoryBadge category={article.category} size="sm" />
          <h3 className="font-headline text-base font-semibold mt-1 line-clamp-2 group-hover:underline">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {article.readTime} min read
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden mb-3">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CategoryBadge category={article.category} size="sm" />
        <h3 className="font-headline text-lg font-semibold mt-2 line-clamp-2 group-hover:underline">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {article.author} • {article.readTime} min
        </p>
      </article>
    );
  }

  return (
    <article className="group cursor-pointer">
      <div className="aspect-[16/10] overflow-hidden mb-4">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CategoryBadge category={article.category} />
      <h3 className="font-headline text-xl md:text-2xl font-semibold mt-3 line-clamp-3 group-hover:underline">
        {article.title}
      </h3>
      <p className="text-muted-foreground mt-2 line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
        <span className="font-medium text-foreground">{article.author}</span>
        <span>•</span>
        <span>{article.readTime} min read</span>
      </div>
    </article>
  );
};

export default ArticleCard;