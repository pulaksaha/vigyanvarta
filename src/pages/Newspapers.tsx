import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { newspaperService } from '@/services/api';
import { Newspaper } from '@/data/mockArticles';

const Newspapers = () => {
    const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewspapers = async () => {
            try {
                const data = await newspaperService.getNewspapers();
                setNewspapers(data);
            } catch (error) {
                console.error('Error fetching newspapers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewspapers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-headline mb-2">Weekly Newspaper Archive</h1>
                    <p className="text-muted-foreground">
                        Browse and read past editions of our weekly science & technology newspaper
                    </p>
                </div>

                {newspapers.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Newspapers Available</h3>
                                <p className="text-muted-foreground">
                                    There are no newspaper editions uploaded yet. Check back later!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {newspapers.map((newspaper) => (
                            <Card key={newspaper.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPdf(newspaper.pdfUrl)}>
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                            PDF
                                        </span>
                                    </div>
                                    <CardTitle className="line-clamp-2">{newspaper.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-2">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(newspaper.uploadedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        Read PDF
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* PDF Viewer Dialog */}
                <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
                    <DialogContent className="max-w-6xl h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Newspaper Viewer</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 w-full h-full">
                            <iframe
                                src={selectedPdf || ''}
                                className="w-full h-full rounded border"
                                title="PDF Viewer"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </main>

            <Footer />
        </div>
    );
};

export default Newspapers;
