import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
// Note: In production, use environment variables for service account details
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error('Missing Firebase environment variables. Please check your .env file.');
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })
});

const db = admin.firestore();

const migrate = async () => {
    const dbPath = path.resolve(process.cwd(), 'api/db.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const articles = data.articles;

    console.log(`Migrating ${articles.length} articles...`);

    const batch = db.batch();
    articles.forEach((article) => {
        const docRef = db.collection('articles').doc(article.id.toString());
        batch.set(docRef, article);
    });

    await batch.commit();
    console.log('Migration completed successfully!');
    process.exit(0);
};

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
