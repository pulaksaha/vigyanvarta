import { Article } from '@/data/mockArticles';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  title?: string;
}

const ArticleGrid = ({ articles, title }: ArticleGridProps) => {
  const mainArticles = articles.slice(0, 3);
  const sideArticles = articles.slice(3, 6);
  const bottomArticles = articles.slice(6);

  return (
    <section className="container py-8">
      {title && (
        <h2 className="font-headline text-2xl font-bold mb-6 pb-2 border-b border-border">
          {title}
        </h2>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main content - 3 columns */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>

          {/* Bottom row - larger cards */}
          {bottomArticles.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
              {bottomArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <aside className="lg:col-span-1">
          <h3 className="font-headline text-lg font-bold mb-4 pb-2 border-b-2 border-foreground">
            More Stories
          </h3>
          <div className="space-y-0">
            {sideArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ArticleGrid;