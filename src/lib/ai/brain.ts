import { NaiveBayesClassifier } from './classifier';
import { trainingData, responses } from './knowledge';

class BachuBrain {
    classifier: NaiveBayesClassifier;
    isInitialized: boolean = false;

    constructor() {
        this.classifier = new NaiveBayesClassifier();
    }

    init() {
        if (this.isInitialized) return;
        console.log("🐻 Bachu AI: Initializing Neural Pathways...");
        this.classifier.train(trainingData);
        this.isInitialized = true;
        console.log(`🐻 Bachu AI: Online. Vocabulary Size: ${this.classifier.vocabularySize}`);
    }

    process(text: string): { label: string; response: string; score: number } {
        if (!this.isInitialized) this.init();

        const results = this.classifier.classify(text);
        const topResult = results[0];

        // Confidence Threshold
        // Log probabilities are negative. Closer to 0 is better.
        // Heuristic: If top score is significantly low relative to document count/vocab, it might be garbage.
        // For Naive Bayes log-probs, specific thresholds are tricky. We'll mostly rely on relative scoring.
        // But let's act on the top label.

        // Fallback if generic or very short input that doesn't match well
        if (!topResult) {
            return { label: 'fallback', response: this.getRandomResponse('fallback'), score: -Infinity };
        }

        const label = topResult.label;
        const response = this.getRandomResponse(label as keyof typeof responses) || this.getRandomResponse('fallback');

        return { label, response, score: topResult.score };
    }

    getRandomResponse(label: keyof typeof responses): string {
        const options = responses[label];
        if (!options) return "";
        return options[Math.floor(Math.random() * options.length)];
    }
}

export const brain = new BachuBrain();
