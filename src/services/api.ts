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
    }
};
