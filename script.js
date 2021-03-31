let deck;
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let playerGamesWon = 0;
let dealerGamesWon = 0;
let dealerSecondCardIsShown = false;
let playerCardsDealt = 2;
let dealerCardsDealt = 2;
let runAnimations = true;
// let modalIsShown = false;

if (localStorage.getItem("deck") === null){
    fetchDeck();
}
else {
    deck = JSON.parse(localStorage.getItem("deck"));
    run();
}

function fetchDeck() {
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then(res=>res.json())
    .then(data => save(data)) 
}

function save(data) {
    localStorage.setItem("deck", JSON.stringify(data.cards));
    deck = data.cards;
    run();
}

function run() {
    if ($(window).width() < 1024) {
        runAnimations = false;
    }
    
    reset();
    addValues();
    addResultCodes();
    if (runAnimations == true) startGame();
    else startGameNoAnimations();
}

function reset() {
    if (runAnimations == true) {
        returnCardsAnimation();
    }
    deck = JSON.parse(localStorage.getItem("deck"));
    console.log(deck);
    shuffle(deck);
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    dealerSecondCardIsShown = false;
    playerCardsDealt = 2;
    dealerCardsDealt = 2;
    $("#dealer-score").text("");
    $("#player-score").text("");
}

function returnCardsAnimation() {
        for (let i = 1; i <= playerCardsDealt; i++) {
        $(`#player-${i}`).show();
        gsap.to(`#player-${i}`, {duration: 1, rotation:0, x:0, y:0, stagger: 0.5});   
    }

    for (let i = 1; i <= dealerCardsDealt; i++) {
        $(`#dealer-${i}`).show();
        gsap.to(`#dealer-${i}`, {duration: 1, rotation:0, x:0, y:0, stagger: 0.5});   
    }
}

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

function addResultCodes(){
    deck.forEach(card => {
        card.code = card.code.replace("0", "10");
        card.code = card.code.replace("H", "♥");
        card.code = card.code.replace("D", "♦");
        card.code = card.code.replace("C", "♣");
        card.code = card.code.replace("S", "♠");
    });
}

function dealCardsAnimation() {
    disableButtons();
    $("#dealer-hand").css({"visibility":"hidden"})
    $("#player-hand").css({"visibility":"hidden"})
    
    setTimeout(function() {
        gsap.to("#player-1", {duration: 1, rotation:360, x:-946, y:113, stagger: 0.5});
    }, 1000);
    
    setTimeout(function() {
        gsap.to("#dealer-1", {duration: 1, rotation:360, x:-946, y:-118, stagger: 0.5});
    }, 2000);

    setTimeout(function() {
        gsap.to("#player-2", {duration: 1, rotation:360, x:-802, y:113, stagger: 0.5});
    }, 3000);

    setTimeout(function() {
        gsap.to("#dealer-2", {duration: 1, rotation:360, x:-800, y:-118, stagger: 0.5});
    }, 4000);

    setTimeout(function() {
        $("#dealer-hand").css({"visibility":"visible"})
        $("#player-hand").css({"visibility":"visible"})
        $("#player-1").hide();
        $("#dealer-1").hide();
        $("#player-2").hide();
        $("#dealer-2").hide();
        $("#dealer-card-1").flip(true);
        $("#player-card-1").flip(true);
        $("#player-card-2").flip(true);
        $("#dealer-score").text(dealerHand[0].score);
        $("#player-score").text(playerScore);
        enableButtons();
    }, 5000);
}

function startGame(){
    dealCardsAnimation();

    for (let i = 0; i < 2; i++) {
        let playerCard = deck.pop();
        playerHand.push(playerCard);

        let dealerCard = deck.pop();
        dealerHand.push(dealerCard);
    }

    determineAceValue(playerHand);
    playerScore = getScore(playerHand);
    
    $("#dealer-first-card").html(`<div id="dealer-card-1" class="flip">
                                    <div class="front flip">
                                        <img id="card-back" src="img/card-back.png" alt="card">
                                    </div>
                                    <div class="back flip">
                                        <img class="card-front" src="${dealerHand[0].image}" alt="card">
                                    </div>
                                </div>`);
    $("#dealer-next-cards").html(`<div id="dealer-card-2" class="flip">
                                        <div class="front flip">
                                            <img id="card-back" src="img/card-back.png" alt="card">
                                        </div>
                                        <div class="back flip">
                                            <img class="card-front" src="${dealerHand[1].image}" alt="card">
                                        </div>
                                    </div>`);
    $("#dealer-card-1").flip({
        trigger: "manual"});
                                
    $("#dealer-card-2").flip({
        trigger: "manual"});
    
    
    $("#player-cards").html(`<div id="player-card-1" class="flip">
                                    <div class="front flip">
                                        <img id="card-back" src="img/card-back.png" alt="card">
                                    </div>
                                    <div class="back flip">
                                        <img class="card-front" src="${playerHand[0].image}" alt="card">
                                    </div>
                                </div>`);
    $("#player-cards").append(`<div id="player-card-2" class="flip">
                                        <div class="front flip">
                                            <img id="card-back" src="img/card-back.png" alt="card">
                                        </div>
                                        <div class="back flip">
                                            <img class="card-front" src="${playerHand[1].image}" alt="card">
                                        </div>
                                    </div>`);
    $("#player-card-1").flip({
        trigger: "manual"});
                                
    $("#player-card-2").flip({
        trigger: "manual"});
    

    $("#player-games-won").text(playerGamesWon);
    $("#dealer-games-won").text(dealerGamesWon);
    
    checkResultDuringDraw();
}

function startGameNoAnimations() {
    let playerOutput = "";

    for (let i = 0; i < 2; i++) {
        let playerCard = deck.pop();
        playerHand.push(playerCard);
        playerOutput += `<img class="card-front" src="${playerCard.image}" alt="card">`;

        let dealerCard = deck.pop();
        dealerHand.push(dealerCard);
    }

    determineAceValue(playerHand);
    playerScore = getScore(playerHand);
    
    let dealerImage = dealerHand[0].image;
    $("#dealer-first-card").html(`<img class="card-front flip" src="${dealerImage}" alt="card">`);
    $("#dealer-next-cards").html(`<div id="dealer-card-2" class="flip">
                                        <div class="front flip">
                                            <img id="card-back" src="img/card-back.png" alt="card">
                                        </div>
                                        <div class="back flip">
                                            <img class="card-front" src="${dealerHand[1].image}" alt="card">
                                        </div>
                                    </div>`);
    $("#dealer-card-2").flip({
        trigger: "manual"
    });
    
    $("#dealer-score").text(dealerHand[0].score);
    $("#dealer-games-won").text(dealerGamesWon);

    $("#player-cards").html(playerOutput);
    $("#player-score").text(playerScore);
    $("#player-games-won").text(playerGamesWon);
    
    checkResultDuringDraw();
}

function newDrawAnimation() {
    $(`#player-card-${playerCardsDealt}`).css({"visibility":"hidden"});

    if (playerCardsDealt == 3){
        gsap.to(`#player-${playerCardsDealt}`, {duration: 1, rotation:360, x:-660, y:113, stagger: 0.5});
    }

    if (playerCardsDealt == 4){
        gsap.to(`#player-${playerCardsDealt}`, {duration: 1, rotation:360, x:-515, y:113, stagger: 0.5});
    }

    if (playerCardsDealt == 5){
        gsap.to(`#player-${playerCardsDealt}`, {duration: 1, rotation:360, x:-370, y:113, stagger: 0.5});
    }

    if (playerCardsDealt == 6){
        gsap.to(`#player-${playerCardsDealt}`, {duration: 1, rotation:360, x:-225, y:113, stagger: 0.5});
    }

    setTimeout(function() {
        $(`#player-card-${playerCardsDealt}`).css({"visibility":"visible"});
        $(`#player-${playerCardsDealt}`).hide();
        $(`#player-card-${playerCardsDealt}`).flip(true);
        $("#player-score").text(playerScore);
    }, 1000);

    setTimeout(function() {
        enableButtons();
    }, 1500);
}

$("#new-draw").click(function() {
    let card = deck.pop();
    playerHand.push(card);
    playerCardsDealt += 1;

    determineAceValue(playerHand);
    playerScore = getScore(playerHand);
    
    if (runAnimations == true) {
        disableButtons();
        $("#player-cards").append(`<div id="player-card-${playerCardsDealt}" class="flip">
                                        <div class="front flip">
                                            <img id="card-back" src="img/card-back.png" alt="card">
                                        </div>
                                        <div class="back flip">
                                            <img class="card-front" src="${card.image}" alt="card">
                                        </div>
                                    </div>`);
        $(`#player-card-${playerCardsDealt}`).flip({
            trigger: "manual"});

        newDrawAnimation();
    }
    else {
        $("#player-cards").append(`<img class="card-front" src="${card.image}" alt="card">`);
        $("#player-score").text(playerScore);
    }

    checkResultDuringDraw();
});

$("#stay").click(function() {
    determineAceValue(dealerHand);
    dealerScore = getScore(dealerHand);
    dealerSecondCardIsShown = true;
    
    $("#dealer-score").text(dealerScore);

    $("#dealer-card-2").flip(true);
    $("#dealer-score").text(dealerScore);
    if (dealerScore >= 17 && dealerScore <= 21){
        checkResultAfterDraw();
        return;
    }
    
    if (runAnimations == true) {
        disableButtons();
        dealerDraw();
    } 
    else dealerDrawNoAnimations();
});

$(".play-again").click(function() {
    $('#result-modal').modal('hide');
    $('#player-win-modal').modal('hide');
    run();
})

//Remove or fix
$(document).keyup(function(e) {
    if(e.keyCode==13 && $('#result-modal').is(':visible') || $('#player-win-modal').is(':visible')){
        $('#result-modal').modal('hide');
        $('#player-win-modal').modal('hide');
        run();
    }
});

function dealerDraw() {
    (function dealerDrawLoop(i) {
        let j = 2000;
        if (i == 4) j = 0;

        setTimeout(function() {
        
            let card = deck.pop();
            dealerHand.push(card);
            dealerCardsDealt += 1;
    
            determineAceValue(dealerHand);
            dealerScore = getScore(dealerHand);
    
            $("#dealer-next-cards").append(`<div id="dealer-card-${dealerCardsDealt}" class="flip dealer-draw">
                                            <div class="front flip">
                                                <img id="card-back" src="img/card-back.png" alt="card">
                                            </div>
                                            <div class="back flip">
                                                <img class="card-front" src="${card.image}" alt="card">
                                            </div>
                                        </div>`);
            $(`#dealer-card-${dealerCardsDealt}`).flip({
                trigger: "manual"});
    
            $(`#dealer-card-${dealerCardsDealt}`).css({"visibility":"hidden"});
    
            if (dealerCardsDealt == 3){
                setTimeout(function() {
                    gsap.to("#dealer-3", {duration: 1, rotation:360, x:-655, y:-112, stagger: 0.5});
                }, 1000);
                setTimeout(function() {
                    $("#dealer-card-3").css({"visibility":"visible"});
                    $("#dealer-3").hide();
                    $("#dealer-card-3").flip(true);
                    $("#dealer-score").text(dealerScore);
                }, 2000);
            }
            
            if (dealerCardsDealt == 4){
                setTimeout(function() {
                    gsap.to("#dealer-4", {duration: 1, rotation:360, x:-514, y:-112, stagger: 0.5});
                }, 2000);
                setTimeout(function() {
                    $("#dealer-card-4").css({"visibility":"visible"});
                    $("#dealer-4").hide();
                    $("#dealer-card-4").flip(true);
                    $("#dealer-score").text(dealerScore);
                }, 3000);
            }
        
            if (dealerCardsDealt == 5){
                setTimeout(function() {
                    gsap.to("#dealer-5", {duration: 1, rotation:360, x:-373, y:-112, stagger: 0.5});
                }, 3000);
                setTimeout(function() {
                    $("#dealer-card-5").css({"visibility":"visible"});
                    $("#dealer-5").hide();
                    $("#dealer-card-5").flip(true);
                    $("#dealer-score").text(dealerScore);
                }, 4000);
            }

            if (dealerCardsDealt == 6){
                setTimeout(function() {
                    gsap.to("#dealer-6", {duration: 1, rotation:360, x:-232, y:-112, stagger: 0.5});
                }, 4000);
                setTimeout(function() {
                    $("#dealer-card-6").css({"visibility":"visible"});
                    $("#dealer-6").hide();
                    $("#dealer-card-6").flip(true);
                    $("#dealer-score").text(dealerScore);
                }, 5000);
            }
            
            if (dealerScore >= 17 && dealerScore <= 21){
                checkResultAfterDraw();
                return;
            }

            if (dealerScore > 21) {
                checkResultDuringDraw();
                return;
            }
        
        if (--i) dealerDrawLoop(i);
        }, j)
    })(4);   
}

function dealerDrawNoAnimations() {
    while (true) {
        let card = deck.pop();
        dealerHand.push(card);

        determineAceValue(dealerHand);
        dealerScore = getScore(dealerHand);

        $("#dealer-next-cards").append(`<img class="card-front" src="${card.image}" alt="card">`);

        if (dealerScore >= 17 && dealerScore <= 21){
            $("#dealer-score").html(dealerScore);
            checkResultAfterDraw();
            break;
        }

        if (checkResultDuringDraw() == true) {
            $("#dealer-score").html(dealerScore);
            break;
        }
    }
}

function getScore(hand){
    let score = 0;
    
    hand.forEach(card => {
        score += card.score;
    });

    return score;
}

function checkResultDuringDraw() {
    if (playerScore == 21){
        $("#result-title").text("YOU WIN!");
        playerGamesWon += 1;
        renderPlayerWinModal();
        return true;
    }
    
    if (dealerScore > 21){
        $("#result-title").text("DEALER BUST - YOU WIN!");
        playerGamesWon += 1;
        renderModal();
        return true;
    }

    if (playerScore > 21){
        $("#result-title").text("BUST - DEALER WINS!");
        dealerGamesWon += 1;
        setTimeout(function() {
            renderModal();
        }, 1000);
        return true;
    }
}

function checkResultAfterDraw() {
    if (dealerScore > playerScore){
        $("#result-title").text("DEALER WINS!");
            dealerGamesWon += 1;
        renderModal();
    }
    else if (dealerScore < playerScore) {
        $("#result-title").text("YOU WIN!");
        playerGamesWon += 1;
        renderModal();
    }
    else {
        $("#result-title").text("DRAW!");
        renderModal();
    }
}

function determineAceValue(hand) {
    if (amountAcesInHand(hand) > 0 && getScore(hand) > 21) {
        for (let i = 0; i < hand.length; i++){
            if (hand[i].value == "ACE") {
                hand[i].score = 1;
            }

            if (getScore(hand) <= 21) return;
        }
    }
}

function amountAcesInHand(hand) {
    let count = 0;

    hand.forEach(card => {
        if (card.value == "ACE") count++;
    });

    return count;
}

function renderModal() {
    // modalIsShown = true;
    $(".dealer-results").html(`Dealer: ${renderResultsDealer()}`);
    $(".player-results").html(`Player: ${renderResultsPlayer()}`);

    if (dealerCardsDealt == 2){
        setTimeout(function() {
            $("#result-modal").modal({show: true, backdrop: 'static', keyboard: false});       
        }, 500);
    }
    
    if (dealerCardsDealt == 3){
        setTimeout(function() {
            $("#result-modal").modal({show: true, backdrop: 'static', keyboard: false});       
        }, 2500);
    }

    if (dealerCardsDealt == 4){
        setTimeout(function() {
            $("#result-modal").modal({show: true, backdrop: 'static', keyboard: false});       
        }, 3500);
    }

    if (dealerCardsDealt == 5){
        setTimeout(function() {
            $("#result-modal").modal({show: true, backdrop: 'static', keyboard: false});       
        }, 4500);
    }

    if (dealerCardsDealt == 6){
        setTimeout(function() {
            $("#result-modal").modal({show: true, backdrop: 'static', keyboard: false});       
        }, 5500);
    }
}

function renderPlayerWinModal() {
    $(".dealer-results").html(`Dealer: ${renderResultsDealer()}`);
    $(".player-results").html(`Player: ${renderResultsPlayer()}`);

    if (playerCardsDealt == 2){
        setTimeout(function() {
            $("#player-win-modal").modal({show: true, backdrop: 'static', keyboard: false});
        }, 5500);
    }

    if (playerCardsDealt > 2){
        setTimeout(function() {
            $("#player-win-modal").modal({show: true, backdrop: 'static', keyboard: false});
        }, 1500);
    }
}

function renderResultsPlayer() {
    let output = ""

    if (getScore(playerHand) > 21) {
        output = `<b style="color: red;">${getScore(playerHand)}</b> - `;
    }
    else {
        output = `<b>${getScore(playerHand)}</b> - `;
    }
    
    playerHand.forEach(card => {
        output += `${card.code} `
    });
    
    return output;
}

function renderResultsDealer() {
    let output = ""

    if (dealerSecondCardIsShown){
        if (getScore(dealerHand) > 21) {
            output = `<b style="color: red;">${getScore(dealerHand)}</b> - `;
        }
        else {
            output = `<b>${getScore(dealerHand)}</b> - `;
        }

        dealerHand.forEach(card => {
            output += `${card.code} `
        });
    }
    else{
        output = `<b>${dealerHand[0].score}</b> - ${dealerHand[0].code}`;
    }
    
    return output;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
}   

function disableButtons() {
    $("#new-draw").attr('disabled', 'disabled');
    $("#stay").attr('disabled', 'disabled');
}

function enableButtons() {
    $("#new-draw").removeAttr('disabled');
    $("#stay").removeAttr('disabled');
}