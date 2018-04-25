//global variables
var cardDeck, myDeck, playerHand, dealerHand;
var keepPlaying, dealerTurn, clicks;

//setup a 'card' object
function card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
    this.cardImage = 'images/' +name + '_of_' + suit + '.png';
}

//setup a 'deck' object
function deck(){
	this.names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	this.suits = ['hearts','diamonds','spades','clubs'];
	var cards = [];
    
    for( var s = 0; s < this.suits.length; s++ ) {
        for( var n = 0; n < this.names.length; n++ ) {
           if(this.names[n] === 'J' || this.names[n] === 'Q' || this.names[n] === 'K' ) {
              cards.push( new card( 10, this.names[n], this.suits[s] ) );
           }
           else {
            cards.push( new card( n+1, this.names[n], this.suits[s] ) );
           }
        }
    }
    return cards;
}

function shuffleDeck(aDeck) {
    let index = 0;
    let shuffledDeck = [];
    while(aDeck.length > 0) {
        index = Math.floor((Math.random() * aDeck.length)); 
        shuffledDeck.push(aDeck[index]);
        aDeck.splice(index, 1)
    }
    return shuffledDeck;
}

function handValue(aHand) {
   let cardTotal = 0;
   let dealtAce = false;
   for(j = 0; j < aHand.cardsInHand.length; j++){
      if(aHand.cardsInHand[j].name  == 'A'){
         dealtAce = true;
      }
      cardTotal += aHand.cardsInHand[j].value;
   }
   if(dealtAce && ((cardTotal + 10) < 22)) { cardTotal += 10; }
   return cardTotal;
}

function whosTheWinner(dealer, player) {
   if(dealer.handValue < 22 && dealer.handValue > player.handValue) {
      return -1;
   }
   else if( player.handValue < 22 && player.handValue > dealer.handValue) {
      return 1;
   }
   else if(player.handValue === dealer.handValue) {
      return 0;
   }
}

function gotBlackjack(aHand) {
   if(aHand.cardsInHand === 2 && aHand.handValue ===21) 
   { return true; }
   else 
   {return false; }
}

function playerPayout(dealer, player, bet) {
   let dealerCards = dealer.handValue;
   let playerCards = player.handValue;
   console.log(`dealerCards is ${dealerCards}, playerCards is ${playerCards}`);
   if(dealerCards < 22 && dealerCards > playerCards ){
      //player loses;
      console.log("player lost");
   }
   else if(playerCards < 22 && playerCards > dealerCards){
      console.log("dealer lost");
      player.playerBank += (player.bet * 2);
   }
   else if(gotBlackjack(player) && !gotBlackjack(dealer)) {
      player.playerBank += player.bet + (player.bet * 1.5);
   }
   //else it's a push nothing happens
   console.log('player.playerBank', player.playerBank);
}

function showPlayerBankroll(aHand) { $('#player-cash').text(`Bankroll: $${playerHand.playerBank}`);}
function showCurrentBet(bet) { $('#current-bet').text(`Current Bet: $${bet}`);}
function showDealerHandValue(aHand){ $('#the-dealer').text(`Dealer: ${aHand.handValue}`);}
function showPlayerHandValue(aHand){ $('#the-player').text(`Player: ${aHand.handValue}`);}

function showBustOptions() {
   $('#hit-button').hide();
   $('#stand-button').hide();
   $('#place-bet').show();
   $('#cash-out').show();
}

function initialize () {
   //Program variables
   cardDeck = new deck();
   playerHand = {cardsInHand: [], handValue: 0, playerBank: 0, playerBet: 0};
   dealerHand = {cardsInHand: [], handValue: 0};
   keepPlaying = true;
   //create deck and shuffle it
   myDeck = shuffleDeck(cardDeck);
   dealerTurn = true;
   clicks = 2;
   bet = 0;
}

function resetHand(dealer, player){
   $('#player-hand').empty();
   $('#dealer-hand').empty();
   dealerTurn = true;
   $('#deal-button').show();
   $('#hit-button').show();
   $('#stand-button').show();
   $('#the-dealer').text('Dealer:');
   $('#the-player').text('Player:');
   dealer.handValue = 0;
   dealer.cardsInHand.splice(0, dealer.cardsInHand.length);
   player.handValue = 0;
   player.bet = 0;
   player.cardsInHand.splice(0, player.cardsInHand.length);
}


$(document).ready(function(){

   //show modal to request player bankroll
   initialize();
   $('#exampleModal').modal("show");
   
   $('#bankroll-save').click(function(){
      if(parseInt($('#player-bankroll').val()) > 0){
         playerHand.playerBank = parseInt($('#player-bankroll').val());
         showPlayerBankroll(playerHand);
         $('#exampleModal').modal("hide");   
      }
      else {
         $("#player-bankroll").val("");
         $("#player-bankroll").attr('placeholder', 'GREATER THAN 0!');
      }
   });
   
   $('#place-bet').click(function() {
      // resetHand(dealerHand, playerHand);
      $('#bettingModal').modal("show");
      $('#aBet').unbind();
      $('#aBet').click(function() {
         console.log("I CLICKED THE BET");
         resetHand(dealerHand, playerHand);
         playerHand.bet = parseInt($('#player-bet').val());
         if(playerHand.bet > 0 && playerHand.bet <= playerHand.playerBank){
            showCurrentBet(playerHand.bet);
            $('#bettingModal').modal("hide");
            playerHand.playerBank -= playerHand.bet;
            console.log("What is my bank?", playerHand.playerBank);
            showPlayerBankroll(playerHand);
            //******NOT WORKING******
            //the case where the error below needs to be cleared.
            // $('#bet-error').empty();
         }
         else {
            //player doesn't have that much
            $('#bet-error').append("<p id='errorMsg' style='color:red;'>THAT'S MORE THAN YOU HAVE!!!</p>");
         }
      });
   });
   
   $('#deal-button').click(function(){
      $('#place-bet').hide();
      $('#cash-out').hide();
      //Initial Deal
      playerHand.cardsInHand.push(myDeck.pop());
      dealerHand.cardsInHand.push(myDeck.pop());
      playerHand.cardsInHand.push(myDeck.pop());
      dealerHand.cardsInHand.push(myDeck.pop());
      $('#player-hand').append("<img class='cards' src='"+playerHand.cardsInHand[0].cardImage +"'/img>");
      $('#dealer-hand').append("<img id='dealer-first-card' class='cards' src='images/red_joker.png'/img>");
      $('#player-hand').append("<img class='cards' src='"+playerHand.cardsInHand[1].cardImage +"'/img>");
      $('#dealer-hand').append("<img class='cards' src='"+dealerHand.cardsInHand[1].cardImage +"'/img>");
      dealerHand.handValue = handValue(dealerHand);
      playerHand.handValue = handValue(playerHand);
      if(playerHand.handValue === 21) { 
         $('#the-player').text('BLACKJACK');
         showBustOptions();
         
      }
      else { showPlayerHandValue(playerHand); }
      $('#deal-button').hide();
   });
   
   $('#hit-button').click(function(){
      //if player doesn't have 21
      if(playerHand.handValue < 22) {
         playerHand.cardsInHand.push(myDeck.pop());
         $('#player-hand').append("<img class='cards' src='"+playerHand.cardsInHand[clicks].cardImage +"'/img>")
         playerHand.handValue = handValue(playerHand);
         if(playerHand.handValue > 21) {
            $('#the-player').text('Player BUSTS');
            showBustOptions();
         }
         else {
            $('#the-player').text(`Player Has: ${playerHand.handValue}`);
            clicks++;
         }
      }
   });
   
   $('#stand-button').click(function(){
      $('#place-bet').show();
      $('#cash-out').show();
      clicks = 2;
      $('#dealer-first-card').attr('src', dealerHand.cardsInHand[0].cardImage);
      $('#the-dealer').append(dealerHand.handValue);
      while(dealerTurn){
         if(dealerHand.handValue <= 16) {
            //draw card and show then calculate
            dealerHand.cardsInHand.push(myDeck.pop());
            $('#dealer-hand').append("<img class='cards' src='"+dealerHand.cardsInHand[clicks].cardImage +"'/img>");
            dealerHand.handValue = handValue(dealerHand);
            showDealerHandValue();
            clicks++;
         }
         else {
            dealerTurn = false;
            playerPayout(dealerHand, playerHand);
            $('#player-cash').text(`Bankroll $${playerHand.playerBank}`);
            //Calculate Winner
            // $('#messages').append(whosTheWinner(dealerHand, playerHand));
         }
      }
   });
   
   $('#cash-out').click(function(){
      $('#cashOutModal').modal("show");
      console.log("THANKS FOR PLAYING");
      $('#winnings').append(` $${playerHand.playerBank}`);
   });
});