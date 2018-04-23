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
      return "House Wins..."
   }
   else if( player.handValue < 22 && player.handValue > dealer.handValue) {
      return "Player Wins!!!";
   }
   else if(player.handValue === dealer.handValue) {
      return "PUSH";
   }
}

$(document).ready(function(){
   $('#modal-container').modal('show');
   
   
   //create deck and shuffle it
   var myDeck = new deck();
   myDeck = shuffleDeck(myDeck);
   //setup player and dealer hands for game play
   var playerHand = {cardsInHand: [], handValue: 0};
   var dealerHand = {cardsInHand: [], handValue: 0};
   var dealerTurn = true;
   var clicks = 2;

   $('#deal-button').click(function(){
      //Initial Deal
      playerHand.cardsInHand.push(myDeck.pop());
      dealerHand.cardsInHand.push(myDeck.pop());
      playerHand.cardsInHand.push(myDeck.pop());
      dealerHand.cardsInHand.push(myDeck.pop());
      $('#player-hand').append("<img class='cards' src='"+playerHand.cardsInHand[0].cardImage +"'/img>")
      $('#dealer-hand').append("<img id='dealer-first-card' class='cards' src='images/red_joker.png'/img>")
      $('#player-hand').append("<img class='cards' src='"+playerHand.cardsInHand[1].cardImage +"'/img>")
      $('#dealer-hand').append("<img class='cards' src='"+dealerHand.cardsInHand[1].cardImage +"'/img>")
      dealerHand.handValue = handValue(dealerHand);
      playerHand.handValue = handValue(playerHand);
      if(playerHand.handValue === 21) { $('#the-player').text('BLACKJACK'); }
      else { $('#the-player').append(playerHand.handValue); }
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
         }
         else {
            $('#the-player').text(`Player Has: ${playerHand.handValue}`);
            clicks++;
         }
      }
   });
   
   $('#stand-button').click(function(){
      clicks = 2;
      $('#dealer-first-card').attr('src', dealerHand.cardsInHand[0].cardImage);
      $('#the-dealer').append(dealerHand.handValue);
      while(dealerTurn){
         if(dealerHand.handValue <= 16) {
            //draw card and show then calculate
            dealerHand.cardsInHand.push(myDeck.pop());
            $('#dealer-hand').append("<img class='cards' src='"+dealerHand.cardsInHand[clicks].cardImage +"'/img>");
            dealerHand.handValue = handValue(dealerHand);
            $('#the-dealer').text(`Dealer Has: ${dealerHand.handValue}`);
            clicks++;
         }
         else {
            dealerTurn = false;
            //Calculate Winner
            $('#messages').append(whosTheWinner(dealerHand, playerHand));
         }
      }
   });
});