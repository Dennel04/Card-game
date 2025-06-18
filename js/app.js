const { createApp } = Vue;

createApp({
    data() {
        return {
            cards: [],
            flippedCards: [],
            moves: 0,
            gameOver: false,
            canFlip: true,
            symbols: ['🎯', '🎨', '🎪', '🎭', '🎬', '🎮', '🎲', '🎸']
        }
    },
    computed: {
        matchedPairs() {
            return this.cards.filter(card => card.hide).length / 2;
        }
    },
    mounted() {
        this.initializeGame();
    },
    methods: {
        initializeGame() {
            // Create card pairs
            const cardPairs = [];
            for (let i = 0; i < 8; i++) {
                cardPairs.push(this.symbols[i], this.symbols[i]);
            }
            
            // Shuffle cards
            this.shuffleArray(cardPairs);
            
            // Create card objects
            this.cards = cardPairs.map(symbol => ({
                symbol: symbol,
                flipped: false,
                matched: false,
                hide: false
            }));
            
            this.flippedCards = [];
            this.moves = 0;
            this.gameOver = false;
            this.canFlip = true;
        },
        
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        },
        
        flipCard(index) {
            const card = this.cards[index];
            
            // Check if card is already flipped or player cannot click
            if (!this.canFlip || card.flipped || card.matched || card.hide) {
                return;
            }
            
            // Flip the card
            card.flipped = true;
            this.flippedCards.push(index);
            
            // If two cards are flipped
            if (this.flippedCards.length === 2) {
                this.moves++;
                this.canFlip = false;
                
                const [firstIndex, secondIndex] = this.flippedCards;
                const firstCard = this.cards[firstIndex];
                const secondCard = this.cards[secondIndex];
                
                if (firstCard.symbol === secondCard.symbol) {
                    // Cards match - mark as matched
                    setTimeout(() => {
                        firstCard.matched = true;
                        secondCard.matched = true;
                        
                        // After short delay, hide cards
                        setTimeout(() => {
                            firstCard.hide = true;
                            secondCard.hide = true;
                            
                            this.flippedCards = [];
                            this.canFlip = true;
                            
                            // Check if game is over
                            this.checkGameOver();
                        }, 500);
                    }, 300);
                } else {
                    // Cards don't match - flip back
                    setTimeout(() => {
                        firstCard.flipped = false;
                        secondCard.flipped = false;
                        this.flippedCards = [];
                        this.canFlip = true;
                    }, 800);
                }
            }
        },
        
        checkGameOver() {
            const allMatched = this.cards.every(card => card.hide);
            if (allMatched) {
                setTimeout(() => {
                    this.gameOver = true;
                }, 500);
            }
        },
        
        restartGame() {
            this.initializeGame();
        }
    }
}).mount('#app');