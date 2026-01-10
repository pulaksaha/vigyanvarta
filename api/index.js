import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
// Use process.cwd() for robust pathing on Vercel
const DB_PATH = path.resolve(process.cwd(), 'api/db.json');

app.use(cors());
app.use(express.json());

// Helper to read DB
const getDb = () => {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

// Routes
app.get('/api/articles', (req, res) => {
    try {
        const db = getDb();
        res.json(db.articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/api/articles/:id', (req, res) => {
    try {
        const db = getDb();
        const article = db.articles.find(a => a.id === req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// Conditionally listen
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
