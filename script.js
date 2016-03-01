// NHO: For variables such as these which we know will not change,
// would recommend following the constant convention for naming: ALLCAPS, eg. SUITS
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var suits = ["clubs", "diamonds", "hearts", "spades"];

var game = {
  // NHO: if you consider refactoring to an OOJS approach,
  // could think about which of these key-values make sense included in constructor function vs prototype
  deck: [],
  hands: [],
  players: ["Player 1", "Computer"],
  stage: [],
  war: [],
  // NHO: love the semantic grouping!
  elements: {
    resetButton: document.getElementById("reset"),
    flipButton: document.getElementById("flip"),
    stagingArea: document.querySelector(".stage-area"),
    gameUpdates: document.querySelector(".updates")
  },

  newDeck: function() {
    var self = this;
    values.forEach(function(value) {
      suits.forEach(function(suit) {
        self.deck.push({value: value, suit: suit, weight: values.indexOf(value)});
        // weight is how we will determine winners
        // NHO: code comments +1!
      });
    });
  },

  shuffleDeck: function() {
    // NHO: for this method, I think it makes the most sense to:
    //  - take an array (deck) as a parameter
    // - return the shuffled array (deck) as output
    // follows best practice for functions to be PURE
    //  - meaning only input and output, rather than relying on side effects to update program's state

    // Fisher-Yates shuffle
    for (var i = this.deck.length - 1; i > 0; i--) {
      var randomIndex = Math.floor(Math.random() * i);
      var hold = this.deck[i];
      this.deck[i] = this.deck[randomIndex];
      this.deck[randomIndex] = hold;
    }
  },

  setUpHands: function() {
    // create hand objects for each player
    var self = this;
    this.players.forEach(function(player) {
      self.hands.push({name: player, cards: []});
    });
  },

  dealCards: function() {
    // NHO: have gone back and forth on whether its worth it to simplify this method
      // i.e. just randomly assign half the deck to one player via .splice(0,26)
      // but feel like this is best representation of actually dealing cards
    // deal one card to each player, then repeat until the deck is empty
    while (this.deck.length > 0) {
      for (var i = 0; i < this.hands.length; i++) {
        // if there are no cards remaining stop dealing
        if (this.deck.length < 1) {
          break;
        } else {
          this.hands[i].cards.push(this.deck.pop());
        }
      }
    }
  },

  cardsToStage: function() {
    // put the top card in each players hand to the staging area
    for (var i = 0; i < this.players.length; i++) {
      this.stage.push({player: this.players[i], card: this.hands[i].cards.pop()});
    }
  },

  getWinner: function() {
    //compare cards in stage by weight
    this.stage.sort(function(a, b) {
      return b.card.weight - a.card.weight;
    });
  },

  buildWarStage: function() {
    // IF the card weight is equal
    // go back 4 indexes in hands
    // compare again
    // IF equal go back 4 more indexes and compare again
    // repeat until someone wins
    // all cards go to winners hand
    var self = this;
    this.stage.forEach(function(hand) {
      self.war.push({player: hand.player, cards: []});
    });
    this.hands.forEach(function(hand) {
      // NHO: if player hand...
      if (hand.name === self.war[0].player) {
        for (var j = 0; j < 4; j++) {
          self.war[0].cards.push(hand.cards.pop());
        }
        // NHO: if computer hand...
      } else if (hand.name === self.war[1].player) {
        for (var k = 0; k < 4; k++) {
          self.war[1].cards.push(hand.cards.pop());
        }
      }
    });
  },
  // how could we combine this method, with the above buildWarStage method
  playWarAgain: function() {
    var self = this;
    this.hands.forEach(function(hand) {
      if (hand.name === self.war[0].player) {
        for (var j = 0; j < 4; j++) {
          self.war[0].cards.push(hand.cards.pop());
        }
      } else if (hand.name === self.war[1].player) {
        for (var k = 0; k < 4; k++) {
          self.war[1].cards.push(hand.cards.pop());
        }
      }
    });
    this.warWinner();
  },

  warWinner: function() {
    // grab the last card in players war pile
    // NHO: thinking about this again, a better name might be cardIndexToCompare...
    var cardToCompare = this.war[0].cards.length - 1;
    if (this.war[0].cards[cardToCompare].weight === this.war[1].cards[cardToCompare].weight) {
      alert("Another War!!");
      this.playWarAgain();
    } else {
      this.war.sort(function(a, b) {
        return b.cards[cardToCompare].weight - a.cards[cardToCompare].weight;
      });
    }
  },

  showCards: function() {
     // NHO: have been thinking about how to speed this up:
     // One option might be to have predefined classes, then use data-attributes or JS to dynamically add and remove the correct classes
    var self = this;
    for (var i = 0; i < 2; i++) {
      var stageCard = document.createElement("div");
      var cardValue = this.stage[i].card.value;
      var cardSuit = this.stage[i].card.suit;
      stageCard.style.backgroundImage = "url(images/" + cardValue + "_of_" + cardSuit + ".png)";
      stageCard.style.backgroundSize = "cover";
      stageCard.setAttribute("class","stage-card");
      this.elements.stagingArea.appendChild(stageCard);
      setTimeout(function () {
        var cards = document.querySelectorAll(".stage-card");
        for (var i = 0; i < cards.length; i++) {
          self.elements.stagingArea.removeChild(cards[i]);
        }
      }, 2000);
    }
  },

  flipCards: function() {
    // NHO: one way to help improve readibility / remove complexity would be to save reoccuring values into local variables used in this method
    this.cardsToStage();
    this.showCards();
    if (this.stage[0].card.weight === this.stage[1].card.weight) {
      this.buildWarStage();
      this.warWinner();
      if (this.war[0].player === this.hands[0].name) {
        this.giveWarCards(this.hands[0]);
        this.playUpdates("It's a tie! You won the WAR!");
      } else {
        this.giveWarCards(this.hands[1]);
        this.playUpdates("It's a tie! The computer won the WAR.");
      }
      this.giveStageCards(this.war[0]);
      this.war = [];
    } else {
      this.getWinner();
      this.giveStageCards(this.stage[0]);
      if (this.stage[0].player === this.hands[0].name) {
        this.playUpdates("You won the hand!");
      } else if (this.stage[0].player === this.hands[1].name) {
        this.playUpdates("The computer won the hand.");
      }
    }
    if (this.hands[0].cards.length === 0) {
      alert("Game Over! You Win!");
    } else if (this.hands[1].cards.length === 0) {
      alert("Game Over! Computer Wins");
    }
  },

  updateRemainingCards: function() {
    var playerRemaining = document.querySelector(".remaining .player");
    var computerRemaining = document.querySelector(".remaining .computer");

    playerRemaining.innerHTML = "Remaining Cards: " + this.hands[0].cards.length;
    computerRemaining.innerHTML = "Remaining Cards: " + this.hands[1].cards.length;
  },

  giveStageCards: function(playerToGive) {
    var winner = playerToGive.player;
    for (var i = 0; i < this.stage.length; i++) {
      for (var j = 0; j < this.hands.length; j++) {
        if (this.hands[j].name === winner) {
          this.hands[j].cards.unshift(this.stage[i].card);
        }
      }
    }
  },

  giveWarCards: function(playerToGive) {
    for (var y = 0; y < this.war[0].cards.length; y++) {
      playerToGive.cards.unshift(this.war[0].cards[y]);
      playerToGive.cards.unshift(this.war[1].cards[y]);
    }
  },

  playUpdates: function(update) {
    this.elements.gameUpdates.innerText = update;
  },

  reset: function() {
    this.deck = [];
    this.hands = [];
    this.stage = [];
    this.war = [];
    this.newDeck();
    this.shuffleDeck();
    this.setUpHands();
    this.dealCards();
    this.updateRemainingCards();
    game.playUpdates("The deck has been shuffled and dealt. CLICK the player deck to flip the cards!");
  }
};

game.newDeck();
game.shuffleDeck();
game.setUpHands();
game.dealCards();

game.elements.resetButton.addEventListener("click", function() {
  game.reset();
});

game.elements.flipButton.addEventListener("click", function() {
  game.flipCards();
  game.stage = [];
  game.updateRemainingCards();
});

game.playUpdates("The deck has been shuffled and dealt. CLICK the player deck to flip the cards!");

// NHO: Overall, this is some good, solid code! Great job taking an object-oriented approach
// and then thinking critically about how to break down the game into its logical methods / components.

// Some things to consider in the future:
//  - how you could remove complexity where possible
//  - What components of your code are you hard-coding? How could those be dynamic?
// - What blocks of code are used often? How could we make it more DRY
// - How could we utilize other libraries such as jQuery to help clean up code?
// -What would be the benefits of incorporating constructor functions and prototypes?
