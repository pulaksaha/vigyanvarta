import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '@/services/api';
import { Article } from '@/data/mockArticles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ArticleDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const data = await articleService.getArticleById(id);
                setArticle(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load article');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-lg">Loading article...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <div className="container py-8 max-w-4xl">
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-4 flex items-center gap-2"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} /> Back
                    </Button>

                    <article className="space-y-6">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="capitalize">
                                {article.category}
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight">
                                {article.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-2 border-y">
                                <span className="flex items-center gap-2">
                                    <User size={16} /> {article.author}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} /> {article.publishedAt}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={16} /> {article.readTime} min read
                                </span>
                            </div>
                        </div>

                        <div className="aspect-video relative rounded-xl overflow-hidden bg-muted">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <p className="text-xl font-medium text-muted-foreground mb-8">
                                {article.excerpt}
                            </p>
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {article.content}
                            </div>
                        </div>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ArticleDetail;
