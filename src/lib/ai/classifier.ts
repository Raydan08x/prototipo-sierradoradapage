export class NaiveBayesClassifier {
    tokenizer: (text: string) => string[];
    stemmer: (word: string) => string;
    vocabulary: Set<string>;
    documentCount: number;
    classCounts: { [key: string]: number };
    wordCounts: { [key: string]: { [word: string]: number } };
    vocabularySize: number = 0;

    constructor() {
        // Simple tokenizer: split by spaces, remove punctuation
        this.tokenizer = (text: string) => text.toLowerCase().replace(/[^\w\sñáéíóúü]/g, '').split(/\s+/).filter(w => w.length > 0);
        // Basic Spanish Stemmer (heuristic for simple chatbot)
        this.stemmer = (word: string) => {
            if (word.endsWith('es')) return word.slice(0, -2);
            if (word.endsWith('s')) return word.slice(0, -1);
            if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) return word.slice(0, -2);
            return word;
        };

        this.vocabulary = new Set();
        this.documentCount = 0;
        this.classCounts = {};
        this.wordCounts = {};
    }

    train(documents: { text: string; label: string }[]) {
        documents.forEach(doc => {
            this.documentCount++;
            const label = doc.label;

            if (!this.classCounts[label]) {
                this.classCounts[label] = 0;
                this.wordCounts[label] = {};
            }
            this.classCounts[label]++;

            const tokens = this.tokenizer(doc.text);
            tokens.forEach(token => {
                const stem = this.stemmer(token);
                this.vocabulary.add(stem);

                if (!this.wordCounts[label][stem]) {
                    this.wordCounts[label][stem] = 0;
                }
                this.wordCounts[label][stem]++;
            });
        });

        this.vocabularySize = this.vocabulary.size;
    }

    classify(text: string): { label: string; score: number }[] {
        const tokens = this.tokenizer(text).map(this.stemmer);
        const scores: { [label: string]: number } = {};

        Object.keys(this.classCounts).forEach(label => {
            // Log-probability to prevent underflow
            scores[label] = Math.log(this.classCounts[label] / this.documentCount);

            tokens.forEach(token => {
                const wordCount = this.wordCounts[label][token] || 0;
                // Laplace Smoothing (+1)
                const totalWordsInClass = Object.values(this.wordCounts[label]).reduce((a, b) => a + b, 0);

                scores[label] += Math.log((wordCount + 1) / (totalWordsInClass + this.vocabularySize));
            });
        });

        return Object.entries(scores)
            .map(([label, score]) => ({ label, score }))
            .sort((a, b) => b.score - a.score);
    }
}
