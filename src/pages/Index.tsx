import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import NewsBlocks from '@/components/NewsBlocks';
import ArticleGrid from '@/components/ArticleGrid';
import Footer from '@/components/Footer';
import { Article } from '@/data/mockArticles';
import { articleService } from '@/services/api';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getArticles();
        setArticles(data);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const featuredArticle = articles.find((article) => article.isFeatured) || articles[0];
  const otherArticles = articles.filter((article) => article.id !== featuredArticle?.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {featuredArticle && <HeroSection article={featuredArticle} />}
        <NewsBlocks articles={articles} />
        <ArticleGrid articles={otherArticles} title="Latest News" />
      </main>

      <Footer />
    </div>
  );
};

export default Index;