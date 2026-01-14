import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articleService } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/data/mockArticles';

const categories = [
    'technology', 'science', 'space', 'innovation', 'gadgets', 'research'
];

interface ArticleFormData {
    title: string;
    excerpt: string;
    content: string;
    category: Category;
    author: string;
    imageUrl: string;
    isFeatured: boolean;
    readTime: number;
}

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<ArticleFormData>({
        title: '',
        excerpt: '',
        content: '',
        category: 'technology',
        author: user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
        imageUrl: '',
        isFeatured: false,
        readTime: 5
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const token = await user.getIdToken();
            await articleService.createArticle(formData, token);
            toast.success('Article published successfully!');
            navigate('/');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to publish article');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out');
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Writer's Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
                    </div>
                    <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </div>

                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New Article</CardTitle>
                        <CardDescription>Fill in the details below to publish a new sci-tech news article.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Article Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter a catchy title"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value: Category) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt / Summary</Label>
                                <Textarea
                                    id="excerpt"
                                    placeholder="Short summary for the article preview"
                                    required
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Full Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your article content here..."
                                    className="min-h-[200px]"
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl">Image URL</Label>
                                    <Input
                                        id="imageUrl"
                                        placeholder="https://images.unsplash.com/..."
                                        type="url"
                                        required
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                                    <Input
                                        id="readTime"
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.readTime}
                                        onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="featured"
                                    checked={formData.isFeatured}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                                />
                                <Label htmlFor="featured">Feature this article on the homepage</Label>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Publishing...' : 'Publish Article'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
