const myApp = angular.module("myApp", ['ngSanitize']);

myApp.run(function($rootScope) {
    $rootScope.message = "Yo!"
})

let deckId = "";

function newGame(){
    loadDeck();
    const deck = getFromLocalStorage("deck");
    console.log(deck);
    deckId = deck.deck_id;

    console.log(deck);
    console.log(deckId);
}

const playerHand = [];

let btnNewGame = document.getElementById("new-game");
btnNewGame.addEventListener("click", function() {
    newGame();
    loadDraw(2);
    showCards(2);
    console.log("click");
});

let btnNewCard = document.getElementById("new-draw");
btnNewCard.addEventListener("click", function() {
    loadDraw(1);
    showCards(1);
    console.log("click");
});

function showCards(count){
    let draw = getFromLocalStorage("draw");
    let output = "";
    
    draw.cards.forEach(card => {
        output += `<img src="${card.image}" alt="card">`
        playerHand.push(card);
    });
    
    document.getElementById("player-hand").innerHTML = output;

    console.log(playerHand);
    loadDraw(count);
}

function loadDeck(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res=>res.json())
    .then(data=> sendToLocalStorage("deck", data))
}

function sendToLocalStorage(key, data){
    localStorage.setItem(key,  JSON.stringify(data));
}

function getFromLocalStorage(key){
    let result = JSON.parse(localStorage.getItem(key));
    return result;
}

function loadDraw(count){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`)
    .then(res=>res.json())
    .then(data=> sendToLocalStorage("draw", data))
}







