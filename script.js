const myApp = angular.module("myApp", ['ngSanitize']);

myApp.run(function($rootScope) {
    $rootScope.message = "Yo!"
})


loadDeck();
const deck = getFromLocalStorage("deck");
const deckId = deck.deck_id;
console.log(deck);
console.log(deckId);

loadHand(deckId);

let btnNewCard = document.getElementById("new-card");
btnNewCard.addEventListener("click", function() {
    showCard();
    console.log("click");
});

function showCard(){
    let hand = getFromLocalStorage("hand");

    let output = `<img src="${hand.cards[0].image}" alt="card">`
    document.getElementById("card-1").innerHTML = output;

    loadHand(deckId);
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

function loadHand(deckId){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then(res=>res.json())
    .then(data=> sendToLocalStorage("hand", data))
}







