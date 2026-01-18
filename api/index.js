import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Auth Middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

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

app.post('/api/articles', authenticate, async (req, res) => {
    try {
        if (!db) throw new Error('Database not initialized');
        const articleData = {
            ...req.body,
            publishedAt: new Date().toISOString().split('T')[0],
            authorId: req.user.uid,
        };

        // If no ID provided, let Firestore generate one, then update the document with the ID
        const docRef = await db.collection('articles').add(articleData);
        await docRef.update({ id: docRef.id });

        res.status(201).json({ id: docRef.id, ...articleData });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

app.put('/api/articles/:id', authenticate, async (req, res) => {
    try {
        if (!db) throw new Error('Database not initialized');
        const { id } = req.params;
        const articleData = req.body;

        // Remove id and publishedAt from body if present to avoid overwriting metadata
        delete articleData.id;
        delete articleData.publishedAt;
        delete articleData.authorId;

        await db.collection('articles').doc(id).update(articleData);

        const updatedDoc = await db.collection('articles').doc(id).get();
        res.json({ id, ...updatedDoc.data() });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

app.delete('/api/articles/:id', authenticate, async (req, res) => {
    try {
        if (!db) throw new Error('Database not initialized');
        const { id } = req.params;
        await db.collection('articles').doc(id).delete();
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

// Serve static files from the React app
const distPath = path.resolve(__dirname, '..', 'dist');
import fs from 'fs';

try {
    console.log(`[Startup] __dirname: ${__dirname}`);
    console.log(`[Startup] distPath: ${distPath}`);
    if (fs.existsSync(distPath)) {
        console.log(`[Startup] 'dist' folder found. Contents:`, fs.readdirSync(distPath).slice(0, 5));
    } else {
        console.error(`[Startup] 'dist' folder NOT found at ${distPath}`);
        // Log parent directory to help debug
        const parentDir = path.resolve(distPath, '..');
        console.log(`[Startup] Parent directory contents:`, fs.readdirSync(parentDir));
    }
} catch (err) {
    console.error(`[Startup] Failed to check directory contents:`, err);
}

console.log(`[Production] Serving static files from: ${distPath}`);

app.use(express.static(distPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error(`Error sending index.html from ${indexPath}:`, err);

            // Helpful debugging for missing dist folder
            if (err.code === 'ENOENT') {
                console.error(`CRITICAL: 'index.html' not found at ${indexPath}`);
                console.error(`Please ensure that 'npm run build' was executed.`);
            }

            res.status(500).send('Error loading the application. The frontend build (dist folder) might be missing. Please check backend logs.');
        }
    });
});

// Conditionally listen
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} else {
    // In production (Render, etc.), always listen on the provided PORT
    const prodPort = process.env.PORT || 5001;
    app.listen(prodPort, '0.0.0.0', () => {
        console.log(`Server running in production on port ${prodPort}`);
    });
}

export default app;
