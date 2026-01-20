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
import { Category, Article } from '@/data/mockArticles';

const categories = [
    'home', 'daily-news', 'article', 'weekly-newspaper', 'others'
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
    const [articles, setArticles] = useState<Article[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const initialFormData: ArticleFormData = {
        title: '',
        excerpt: '',
        content: '',
        category: 'article',
        author: user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
        imageUrl: '',
        isFeatured: false,
        readTime: 5
    };

    const [formData, setFormData] = useState<ArticleFormData>(initialFormData);

    // PDF Upload states
    const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
    const [pdfTitle, setPdfTitle] = useState('');
    const [pdfUploading, setPdfUploading] = useState(false);
    const [newspapers, setNewspapers] = useState<Newspaper[]>([]);

    const fetchArticles = async () => {
        try {
            const data = await articleService.getArticles();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    React.useEffect(() => {
        fetchArticles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const token = await user.getIdToken();
            if (isEditing && editId) {
                await articleService.updateArticle(editId, formData, token);
                toast.success('Article updated successfully!');
            } else {
                await articleService.createArticle(formData, token);
                toast.success('Article published successfully!');
            }
            setFormData(initialFormData);
            setIsEditing(false);
            setEditId(null);
            fetchArticles();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (article: Article) => {
        setFormData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            author: article.author,
            imageUrl: article.imageUrl,
            isFeatured: article.isFeatured,
            readTime: article.readTime
        });
        setIsEditing(true);
        setEditId(article.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!user || !window.confirm('Are you sure you want to delete this article?')) return;

        try {
            const token = await user.getIdToken();
            await articleService.deleteArticle(id, token);
            toast.success('Article deleted');
            fetchArticles();
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to delete article');
        }
    };

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out');
        navigate('/');
    };

    const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedPdf(file);
        } else {
            toast.error('Please select a valid PDF file');
        }
    };

    const handlePdfUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedPdf || !pdfTitle) {
            toast.error('Please provide a title and select a PDF file');
            return;
        }

        setPdfUploading(true);
        try {
            const token = await user.getIdToken();

            // For now, we'll use a placeholder URL - in production, this would upload to Firebase Storage
            // or another cloud storage service and return the actual URL
            const pdfUrl = URL.createObjectURL(selectedPdf);

            toast.info('PDF upload feature requires backend configuration for file storage');
            toast.info('Please configure Firebase Storage or alternative storage service');

            // Placeholder for actual upload
            // const pdfUrl = await uploadPdfToStorage(selectedPdf, token);
            // await articleService.createNewspaper({ title: pdfTitle, pdfUrl, category: 'weekly-newspaper' }, token);

            setPdfTitle('');
            setSelectedPdf(null);
            // fetchNewspapers();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to upload PDF');
        } finally {
            setPdfUploading(false);
        }
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

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{isEditing ? 'Edit Article' : 'Create New Article'}</CardTitle>
                            <CardDescription>
                                {isEditing ? 'Update the details of your article.' : 'Fill in the details below to publish a new article.'}
                            </CardDescription>
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
                                                    <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</SelectItem>
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
                            <CardFooter className="flex justify-end gap-4 border-t pt-6">
                                {isEditing && (
                                    <Button type="button" variant="ghost" onClick={() => {
                                        setIsEditing(false);
                                        setEditId(null);
                                        setFormData(initialFormData);
                                    }}>Cancel Edit</Button>
                                )}
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Processing...' : (isEditing ? 'Update Article' : 'Publish Article')}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* List Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Articles</CardTitle>
                            <CardDescription>A list of all published articles. You can edit or delete them from here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {articles.length > 0 ? (
                                    articles.map((article) => (
                                        <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="min-w-0 flex-1 mr-4">
                                                <h4 className="font-semibold truncate">{article.title}</h4>
                                                <p className="text-xs text-muted-foreground capitalize">{article.category} • {article.publishedAt}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(article)}>Edit</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(article.id)}>Delete</Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No articles found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
