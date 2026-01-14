import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Firebase Admin
if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
    });
} else {
    console.warn('Firebase PROJECT_ID not found. Firestore will not be initialized.');
}

const db = admin.apps.length ? admin.firestore() : null;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/articles', async (req, res) => {
    try {
        if (!db) throw new Error('Database not initialized');
        const snapshot = await db.collection('articles').get();
        const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/api/articles/:id', async (req, res) => {
    try {
        if (!db) throw new Error('Database not initialized');
        const doc = await db.collection('articles').doc(req.params.id).get();
        if (doc.exists) {
            res.json({ id: doc.id, ...doc.data() });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (error) {
        console.error('Error fetching article:', error);
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
