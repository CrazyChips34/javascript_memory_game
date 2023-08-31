document.addEventListener('DOMContentLoaded', () => {
//calling the classes
    const selectors = {
        boardContainer: document.querySelector('.game-board-container'),
        board: document.querySelector('.game-board'),
        moves: document.querySelector('.move-counter'),
        timer: document.querySelector('.game-timer'),
        start: document.querySelector('.start-button'),
        restart: document.querySelector('.restart-button'),
        message: document.querySelector('.game-win-message'),
    };
  
    const state = {
        gameStarted: false,
        flippedCards: 0,
        totalFlips: 0,
        totalTime: 100,
        loop: null,

    };
  // cards are shuffled around
    const shuffle = (array) => {
        const clonedArray = [...array];//  creates a clone of the input array using the spread operator

        /* the code takes an array and rearranges its elements randomly, giving you a new array with the same elements in a different order. */
    //  starts a loop that iterates over the cloned array in reverse order, from the last element to the first.
        for (let index = clonedArray.length - 1; index > 0; index--) {
            // the loop, it generates a random index using Math.random() and 
            // multiplies it by the current index plus one (index + 1). 
            //This ensures that the random index falls within the range of the elements remaining to be shuffled.
            const randomIndex = Math.floor(Math.random() * (index + 1));
            // swaps the elements at the random index and the current index.
            const original = clonedArray[index];
           
            //returns the shuffled clone array
            clonedArray[index] = clonedArray[randomIndex];
            clonedArray[randomIndex] = original;
        }
    
        return clonedArray;
    };

    /* the code takes an array and a number of items to pick randomly from that array. 
    It returns a new array containing the randomly selected items, without repeating any item in the result.*/
  // random order of cards
    const pickRandom = (array, items) => {
        const clonedArray = [...array];
        const randomPicks = [];
    
        for (let index = 0; index < items; index++) {
            const randomIndex = Math.floor(Math.random() * clonedArray.length);
    
            randomPicks.push(clonedArray[randomIndex]);
            clonedArray.splice(randomIndex, 1);
        }
    
        return randomPicks;
    };


    // Function to show the victory message
  const showVictoryMessage = () => {
    selectors.boardContainer.classList.add('flipped');
    selectors.message.innerHTML = `
      <span class="game-win-message-text">
        You won! 🎊<br/>
        with <span class="highlight">${state.totalFlips}</span> moves<br/>
        under <span class="highlight">${100 - state.totalTime}</span> seconds
      </span>`;

      selectors.message.classList.add('visible');

    clearInterval(state.loop);
  };

/* the code generates a memory game on a board by randomly selecting a set of emojis, shuffling them, and creating HTML cards for each emoji. 
The cards are then displayed on the board element in the web page, 
allowing players to play the memory game by flipping the cards and finding matching pairs of emojis. */
  //game content 
    const generateGame = () => {
        const dimensions = selectors.board.getAttribute('data-dimension');
    
        if (dimensions % 2 !== 0) {
            throw new Error("The dimension of the board must be an even number.");
        }
    
        const emojis = ['🏫', '📚', '🎓', '✏️', '📝', '📖', '💼', '📋', '📏', '🧠'];
        const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
        const items = shuffle([...picks, ...picks]);
        const cards = items
            .map(
            (item) => `
                <div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
                </div>
            `
            )
            .join("");
        
        
    
    selectors.board.innerHTML = cards;
    };
    /* the code starts the game by setting the game state, updating the UI elements, and starting a timer that counts down the remaining time. 
    When the time runs out, it stops the timer, shows a message, and applies a visual effect to indicate the end of the game. */
    
  //starting game
    const startGame = () => {
        state.gameStarted = true;
        selectors.boardContainer.classList.remove('flipped');
        // selectors.message.style.display = 'none';
    // time running down

    if (state.loop){
        clearInterval(state.loop);
    }

        state.loop = setInterval(() => {
            state.totalTime--;
            selectors.moves.innerText = `Moves: ${state.totalFlips} moves`
            selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    
            if (state.totalTime === 0) {
            clearInterval(state.loop);
            selectors.boardContainer.classList.add('flipped');
            selectors.message.innerHTML = `
                <span class="game-win-message-text">
                Game Over 💔!<br/>
                You ran out of time!<br/>
                Try again!
                </span>`;

                selectors.message.classList.add('visible');
            }
        }, 1000);
    };
    /*the code reverses the flipping action for all the cards that are not yet matched in a memory game. 
    It ensures that the front side of these cards, displaying the emoji or content, is no longer visible. 
    Additionally, it resets the game state by setting the count of flipped cards to 0, indicating that no cards are currently selected. */
  //if not matched turn back over
    const flipBackCards = () => {
        document.querySelectorAll('.card:not(.matched)').forEach((card) => {
            card.classList.remove('flipped');
        });
    
        state.flippedCards = 0;
    };
  
    /* the code handles the flipping and matching of cards in a memory game. 
    It keeps track of the flipped and matched cards, starts the game if not already started, checks for matches, 
    flips back unmatched cards, and displays a victory message when all cards are flipped and matched. */
    const flipCard = (card) => {
        state.flippedCards++;
        state.totalFlips++;

    
        if (!state.gameStarted) {
            startGame();
        }
    
        if (state.flippedCards <= 2) {
            card.classList.add('flipped');
        }
    //if matched stay like that
        if (state.flippedCards === 2) {
            const flippedCards = document.querySelectorAll('.flipped:not(.matched)');
    
            if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            }
    
            setTimeout(() => {
            flipBackCards();
            }, 1000);
        }

        if (!document.querySelectorAll('.card:not(.flipped)').length) {
            setTimeout(() => {
             showVictoryMessage();
             }, 1000);
        }
    
        
    };
    /*, the code attaches event listeners to the document to handle click events. When a card is clicked and it is not already flipped, the corresponding card element is flipped using the "flipCard" function. 
    When a button is clicked and it is not disabled, the game is started using the "startGame" function. 
    This allows the user to interact with the memory game by clicking on cards and starting/restarting the game with the button. */
  
    const attachEventListeners = () => {
        document.addEventListener('click', (event) => {
            const eventTarget = event.target;
            const eventParent = eventTarget.parentElement;
    
            if (
            eventTarget.className.includes('card') &&
            !eventParent.className.includes('flipped')
            ) {
            flipCard(eventParent);
            } else if (
            eventTarget.nodeName === 'BUTTON' &&
            !eventTarget.className.includes('disabled')
            ) {
            startGame();
            }
        });
    };
  
    const restartGame = () => {
        clearInterval(state.loop);
        state.gameStarted = false;
        state.flippedCards = 0;
        state.totalFlips = 0;
        state.totalTime = 100;
        selectors.moves.innerText = 'Moves: 0';
        selectors.timer.innerText = 'Time: 100 sec';
        selectors.start.classList.remove('hidden');
        selectors.boardContainer.classList.remove('flipped');
        selectors.message.innerHTML = '';
        selectors.message.style.display = 'none';

        generateGame();
        attachEventListeners();
    };
  
    selectors.start.addEventListener('click', () => {
        selectors.start.classList.add('hidden');
        selectors.boardContainer.classList.remove('flipped');
    
        startGame();
    });
  
    selectors.restart.addEventListener('click', restartGame);
  
    generateGame();
    attachEventListeners();
});
    

