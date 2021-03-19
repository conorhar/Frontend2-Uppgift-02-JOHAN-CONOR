fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then(res=>res.json())
    .then(data => load(data)) 


function load(data) {
    const deck = data.cards;
    const playerHand = [];
    const dealerHand = [];
    let playerScore = 0;
    let dealerScore = 0;

    console.log(deck);
    addValues();
    startHand();

    function startHand(){
        let playerOutput = "";

        for (let i = 0; i < 2; i++) {
            let playerCard = deck.pop();
            playerHand.push(playerCard);
            playerOutput += `<img src="${playerCard.image}" alt="card">`;

            let dealerCard = deck.pop();
            dealerHand.push(dealerCard);
        }

        playerScore = getPlayerScore();

        console.log(deck);
        console.log(playerHand);
        
        let dealerImage = dealerHand[0].image;
        document.getElementById("dealer-hand").innerHTML = `<img src="${dealerImage}" alt="card">`;
        document.getElementById("dealer-score").innerHTML = dealerHand[0].score;
        
        document.getElementById("player-hand").innerHTML = playerOutput;
        document.getElementById("player-score").innerHTML = playerScore;
    }

    $("#new-draw").click(function() {
        let card = deck.pop();
        playerHand.push(card);

        playerScore = getPlayerScore();
        
        document.getElementById("player-hand").innerHTML += `<img src="${card.image}" alt="card">`;
        document.getElementById("player-score").innerHTML = playerScore;

        checkIfBust(playerScore);
        console.log(deck);
        console.log(playerHand);
    });

    function addValues(){
        deck.forEach(card => {
            card.score = parseInt(card.value);

            if (card.value == "ACE") {
                card.score = 11;
            }

            if (isNaN(card.score)){
                card.score = 10;
            }
        });
    }

    function getPlayerScore(){
        let score = 0;
        
        playerHand.forEach(card => {
            score += card.score;
        });

        return score;
    }

    function getDealerScore() {
        let score = 0;
        
        dealerHand.forEach(card => {
            score += card.score;
        });

        return score;
    }

    function checkIfBust(score) {
        if (score > 21){
            console.log("dealer won");

            document.getElementById("game-result").innerText = "DEALER WON :("
        }
    }
}

// let deckId = "";

// loadDeck();
// let deck = getFromLocalStorage("deck");
// console.log(deck);
// deckId = deck.deck_id;

// console.log(deck);
// console.log(deckId);

// // newGame();

// // function newGame(){
// //     loadDeck();
// //     let deck = getFromLocalStorage("deck");
// //     console.log(deck);
// //     deckId = deck.deck_id;

// //     console.log(deck);
// //     console.log(deckId);
// // }

// const playerHand = [];

// let btnNewGame = document.getElementById("new-game");
// btnNewGame.addEventListener("click", function() {
//     newGame();
//     loadDraw(2);
//     showCards(2);
//     console.log("click");
// });

// function showCards(count){
//     let draw = getFromLocalStorage("draw");
//     let output = "";
    
//     draw.cards.forEach(card => {
//         output += `<img src="${card.image}" alt="card">`
//         playerHand.push(card);
//     });
    
//     document.getElementById("player-hand").innerHTML = output;

//     console.log(playerHand);
//     loadDraw(count);
// }

// function loadDeck(){
//     fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
//     .then(res=>res.json())
//     .then(data=> sendToLocalStorage("deck", data)) 
// }

// function sendToLocalStorage(key, data){
//     localStorage.setItem(key, JSON.stringify(data));
// }

// function getFromLocalStorage(key){
//     let result = JSON.parse(localStorage.getItem(key));
//     return result;
// }

// function loadDraw(count){
//     fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
//     .then(res=>res.json())
//     .then(data=> sendToLocalStorage("draw", data))
// }







