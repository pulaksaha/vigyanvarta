import { Article } from '../data/mockArticles';

const API_BASE_URL = '/api';

export const articleService = {
    async getArticles(): Promise<Article[]> {
        const response = await fetch(`${API_BASE_URL}/articles`);
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        return response.json();
    },

    async getArticleById(id: string): Promise<Article> {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch article');
        }
        return response.json();
    },

    async createArticle(article: Omit<Article, 'id' | 'publishedAt'>, token: string): Promise<Article> {
        const response = await fetch(`${API_BASE_URL}/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(article)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create article');
        }
        return response.json();
    },

    async updateArticle(id: string, article: Partial<Article>, token: string): Promise<Article> {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(article)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update article');
        }
        return response.json();
    },

    async deleteArticle(id: string, token: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete article');
        }
    }
};

export const newspaperService = {
    getNewspapers: async () => {
        const response = await fetch(`${API_BASE_URL}/newspapers`);
        if (!response.ok) throw new Error('Failed to fetch newspapers');
        return response.json();
    },

    createNewspaper: async (newspaperData: { title: string; pdfUrl: string }, token: string) => {
        const response = await fetch(`${API_BASE_URL}/newspapers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newspaperData),
        });
        if (!response.ok) throw new Error('Failed to create newspaper');
        return response.json();
    },

    deleteNewspaper: async (id: string, token: string) => {
        const response = await fetch(`${API_BASE_URL}/newspapers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete newspaper');
        return response.json();
    },
};

