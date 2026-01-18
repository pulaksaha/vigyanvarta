import { Article } from '@/data/mockArticles';
import { Link } from 'react-router-dom';

interface NewsBlocksProps {
  articles: Article[];
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  Science: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-l-blue-500', text: 'text-blue-700 dark:text-blue-400' },
  Technology: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-l-purple-500', text: 'text-purple-700 dark:text-purple-400' },
  Innovation: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-l-green-500', text: 'text-green-700 dark:text-green-400' },
  Research: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-l-orange-500', text: 'text-orange-700 dark:text-orange-400' },
  Gadgets: { bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-l-pink-500', text: 'text-pink-700 dark:text-pink-400' },
  Space: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-l-indigo-500', text: 'text-indigo-700 dark:text-indigo-400' },
};

const NewsBlocks = ({ articles }: NewsBlocksProps) => {
  // Group articles by category
  const categories = ['Science', 'Technology', 'Innovation', 'Research'];

  const groupedArticles = categories.reduce((acc, category) => {
    acc[category] = articles.filter(a => a.category === category).slice(0, 4);
    return acc;
  }, {} as Record<string, Article[]>);

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <section className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const colors = categoryColors[category] || categoryColors.Science;
          const categoryArticles = groupedArticles[category] || [];

          return (
            <div
              key={category}
              className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Block Header */}
              <div className="text-center mb-4 pb-3 border-b border-border">
                <h3 className={`font-headline text-lg font-bold ${colors.text}`}>
                  {category} News
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Last Update: {currentDate}
                </p>
              </div>

              {/* News Items */}
              <div className="space-y-2">
                {categoryArticles.length > 0 ? (
                  categoryArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className={`block p-2.5 rounded ${colors.bg} border-l-4 ${colors.border} hover:translate-x-1 transition-transform`}
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                        {article.title}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No articles available
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewsBlocks;
