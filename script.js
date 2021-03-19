fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then(res=>res.json())
    .then(data => load(data)) 


function load(data) {
    const deck = data.cards;
    const playerHand = [];
    let playerScore = 0;

    console.log(deck);
    addValues();
    startHand();

    function startHand(){
        let output = "";

        for (let i = 0; i < 2; i++) {
            let card = deck.pop();
            playerHand.push(card);
            output += `<img src="${card.image}" alt="card">`
        }

        playerScore = getScore();

        console.log(deck);
        console.log(playerHand);
        
        document.getElementById("player-hand").innerHTML = output;
        document.getElementById("player-score").innerHTML = playerScore;
    }

    let btnNewCard = document.getElementById("new-draw");
    btnNewCard.addEventListener("click", function() {
        let card = deck.pop();
        playerHand.push(card);

        playerScore = getScore();
        
        document.getElementById("player-hand").innerHTML += `<img src="${card.image}" alt="card">`;
        document.getElementById("player-score").innerHTML = playerScore;

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

    function getScore(){
        let score = 0;
        
        playerHand.forEach(card => {
            score += card.score;
        });

        return score;
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







