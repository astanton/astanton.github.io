Poker = (function($) {

		var TOTAL_CARDS = 5;
    var TOTAL_PLAYERS = 3;
    var PAIR_THRESHOLD = .9;
    var SUIT_STRING = '{suit}';
    var CARD_STRING = '{card}';

    var cardBaseURL = "http://h3h.net/images/cards/{suit}_{card}.svg";
    var suits = ['spade', 'heart', 'diamond', 'club'];
    var cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    var playersHands = [];
    var playersPairs = [];
    var cardsInPlay = [];
    
		var $playersHands = [];
    var playedHandsPairedOrNot = [];

    var init = function() {
    		buildPlayerHtml();
        $(".buttons button").on("click", playAgainButtonClicked);
        for (var a = 0; a < TOTAL_PLAYERS; a++) {
        	$playersHands[a] = $(this).find('.player-' + (a+1));
          $playersHands[a].removeClass('winning');
        }
    };
    
    var buildPlayerHtml = function() {
    	var $buttonSection = $('section.buttons');
    
   		for (var a = 1; a <= TOTAL_PLAYERS; a++) {
      	var $section = $('<section>');
        $section.addClass('hand player-' + a);
        
        var $h1 = $('<h1>');
        $h1.text('Player ' + a);
        
        $section.append($h1);
        $buttonSection.before($section);
      }
    };
    
    var playAgainButtonClicked = function() {
    	initializeHtml();
      generateNewDeck();
      drawHands();
      updateCardsInHtml();
      findPairs();
      
      // if we need to draw again becaus the 90% pair threshold hasnt been hit, do it here
      if (needToDrawAgain()) {
      	playAgainButtonClicked();
      }
      
      determineWinner();
    };
    
    var initializePlayers = function() {
    	playersHands = [];
      for (var a = 0; a < TOTAL_PLAYERS; a++) {
      	playersHands[a] = [];
        playersPairs[a] = [];
      }
    }

    var initializeHtml = function() {
    	for (var a = 0; a < TOTAL_PLAYERS; a++) {
        	$playersHands[a].find('img').remove();
          $playersHands[a].removeClass('winning');
        }
    }
    
    var updateCardsInHtml = function() {
    	var imageSource;
 
 			for (var a = 0; a < TOTAL_PLAYERS; a++) {
      	for (var b = 0; b < TOTAL_CARDS; b++) {
        	imageSource = cardBaseURL.replace(SUIT_STRING, playersHands[a][b].suit);
          imageSource = imageSource.replace(CARD_STRING, playersHands[a][b].card);
          
          var $image = $('<img>');
          $image.addClass('card '+ playersHands[a][b].card + '-' + playersHands[a][b].suit);
          $image.attr('src', imageSource);

          $playersHands[a].append($image);
        }
      }
    };
    
    var determineWinner = function() {
    
    	// if a player has more pairs than anyone else they win
    	var winningIndex = findPlayerIndexWithMostPairs();
      if (winningIndex > -1) {
      	$playersHands[winningIndex].addClass('winning');
        return;
      }
      // otherwise check the pairs
      else {
      	// build the comparison array then iterate over it to find out who has most players beat
      	var pairComparisonArray = buildPlayerPairComparisonArray();
        winningIndex = findPlayerIndexWithMostBeatenOpponents(pairComparisonArray);
        if (winningIndex > -1) {
        	$playersHands[winningIndex].addClass('winning');
        }
      }
    };
    
    // this builds a comparison array where the longest arrays inside of the
    // returned array means the player at that index has that many other
    // players beat
    var buildPlayerPairComparisonArray = function() {
    	var comparisonArray = [];
    	_.each(playersPairs, function(playerPairs, index) {
        comparisonArray[index] = [];
      });

      // loop through all players and compare hands
    	_.each(playersPairs, function(currentPlayerPairs, currentIndex) {
       	_.each(playersPairs, function(opponentPairs, opponentIndex) {
          
         	// dont compare to self
           if (currentIndex !== opponentIndex) {

            // if current player has more pairs then they beat opponent
            if (currentPlayerPairs.length > opponentPairs.length) {
             	comparisonArray[currentIndex].push(true);
            }
            // if same amount of pairs, we have to compare pairs
            else if (currentPlayerPairs.length === opponentPairs.length) {
             	for (var a = 0; a < currentPlayerPairs.length; a++) {
               	if (cards.indexOf(currentPlayerPairs[a]) > cards.indexOf(opponentPairs[a])) {
                 	comparisonArray[currentIndex].push(true);
                  break;
                }
              }
            }
          }
        });
      });
      return comparisonArray;
    }
    
    // this will find the player index with the most pairs, -1 if there isn't just 1
    var findPlayerIndexWithMostPairs = function() {
    	return findIndexOfLongestArray(playersPairs);
    }
    
    // this finds the index of the player who has beaten more players
    var findPlayerIndexWithMostBeatenOpponents = function(comparisonArray) {
    	return findIndexOfLongestArray(comparisonArray);
    }
    
    // helper function that takes an array of arrays and will return the index
    // of the array that is the longest.  if multiple arrays have the max length
    // then it will return -1
    var findIndexOfLongestArray = function(arrryOfArrays) {
    
    	var maxIndex = -1;
      var maxLength = 0;
      var multiple = false;
      
      _.each(arrryOfArrays, function(arr, index) {
      
      	// if current player has the most pairs
      	if (arr.length > maxLength) {
        	maxLength = arr.length;
          maxIndex = index;
          multiple = false;
        }
        // if current player has the same amount as most pairs, set flag to true
        else if ( arr.length === maxLength) {
        	multiple = true;
        }
      })
      
      // if there are multiple with highest pairs, then no one has highest pairs
      if (multiple) {
      	maxIndex = -1;
      }

      return maxIndex;
    }
    
    var generateNewDeck = function() {
    	cardsInPlay = [];
      for (var a = 0; a < suits.length; a++) {
      	for (var b = 0; b < cards.length; b++) {
        	cardsInPlay.push({
          	suit: suits[a],
            card: cards[b]
          });
        }
      }
    };
    
    // takes turns picking cards between player 1 and 2
    var drawHands = function() {
    	initializePlayers();
   		for (var a = 0; a < TOTAL_CARDS; a++) {
      	for (var b = 0; b < TOTAL_PLAYERS; b++) {
        	getRandomCard(b);
        }
      }
    };
    
    // checks if with the current dealt hand it falls into the at least 90% of
    // hands have pairs and if not, it returns true to call for a redraw
    var needToDrawAgain = function() {
   		var currentHand = 0;
      _.each(playersPairs, function(pairs) {
      	if (pairs.length > 0) {
        	currentHand = 1;
        }
      });
      
      playedHandsPairedOrNot.push(currentHand);
      var sum = 0;
      _.each(playedHandsPairedOrNot, function(value) {
      	sum += value;
      });
      
      if ((sum/playedHandsPairedOrNot.length).toPrecision(2) < PAIR_THRESHOLD) {
      	playedHandsPairedOrNot.pop();
        return true;
      }
    }
    
    var getRandomCard = function(player) {
    	var index = Math.floor(Math.random() * (suits.length * cards.length)) % cardsInPlay.length;
      playersHands[player].push(cardsInPlay.splice(index, 1)[0]);
    };
    
    var findPairs = function() {
    
    	var processedCards = [];
      for (var a = 0; a < TOTAL_PLAYERS; a++) {
      	processedCards[a] = [];
      }
    
    	_.each(playersHands, function(playerHand, playerIndex) {
      	_.each(playerHand, function(card) {
        	
          var processedIndex = _.findIndex(processedCards[playerIndex], function(processedCard) {
          	return processedCard.card === card.card;
          })
          
          // if this card hasn't been processed or has already paired
        	if (processedIndex === -1) {
          	processedCards[playerIndex].push(card);
          }
          // otherwise it is in there and we have a pair
          else {
          	var pair = processedCards[playerIndex].splice(processedIndex,1)[0];
            var pairClass = 'pair' + playersPairs[playerIndex].length;
            $playersHands[playerIndex].find('.' + pair.card + '-' + pair.suit).addClass(pairClass);
            $playersHands[playerIndex].find('.' + card.card + '-' + card.suit).addClass(pairClass);
            
            // if the new pair is greater than the existing pair pair, put in front of the array
            if (playersPairs[playerIndex].length > 0 &&
            	  cards.indexOf(card.card) > cards.indexOf(_.first(playersPairs[playerIndex]))) {
            	playersPairs[playerIndex].unshift(pair.card);
            }
            // otherwise just push onto the array
            else {
            	playersPairs[playerIndex].push(pair.card);
            }
            
          }
        })
      })
    }
    
    // helper function for debugging
    var displayCards = function() {
    	for (var a = 0; a < playersHands.length; a++) {
      	console.log("PLAYER " + (a+1) + " CARDS");
      	for (var b = 0; b < TOTAL_CARDS; b++) {
        	console.log(playersHands[a][b].card + " OF " + playersHands[a][b].suit);
        }
        console.log("");
      }
    }
    
    // helper function for debugging
    var displayPairs = function() {
    	for (var a = 0; a < playersPairs.length; a++) {
      	console.log("PLAYER " + (a+1) + " PAIRS");
      	for (var b = 0; b < playersPairs[a].length; b++) {
      		console.log(playersPairs[a][b]);
      	}
        console.log("");
      }
    }

    // expose public methods
    return {
        init: init
    };
})(jQuery);

$(document).ready(Poker.init);