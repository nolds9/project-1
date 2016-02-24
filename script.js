var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var suits = ["clubs", "diamonds", "hearts", "spades"];

var game = {
  deck: [],
  hands: [],
  players: ["Player 1", "Computer"],
  stage: [],
  war: [],
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
      });
    });
  },

  shuffleDeck: function() {
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
    if (this.stage[0].card.weight === this.stage[1].card.weight) {
      this.stage.forEach(function(hand) {
        self.war.push({player: hand.player, cards: []});
      });
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
      return true;
    } else {
      return false;
    }
  },

  warWinner: function() {
    this.war.sort(function(a, b) {
      return b.cards[3].weight - a.cards[3].weight;
    });
  },

  showCards: function() {
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
    this.cardsToStage();
    this.showCards();
    if (this.buildWarStage()) {
      var messageArea = document.querySelector(".message");
      messageArea.style.fontSize = "1.5em";
      this.warWinner();
      if (this.war[0].player === this.hands[0].name) {
        for (var y = 0; y < 4; y++) {
          this.hands[0].cards.unshift(this.war[0].cards[y]);
          this.hands[0].cards.unshift(this.war[1].cards[y]);
        }
        messageArea.innerText = "WAR! You win!";
        this.playUpdates("It's a tie! You won the WAR!")
      } else if (this.war[0].player === this.hands[1].name) {
        for (var x = 0; x < 4; x++) {
          this.hands[1].cards.unshift(this.war[0].cards[x]);
          this.hands[1].cards.unshift(this.war[1].cards[x]);
        }
        messageArea.innerText = "WAR! Computer wins.";
        this.playUpdates("It's a tie! The computer won the WAR.")
      }
      setTimeout(function() {
        messageArea.innerText = "";
      }, 2000);
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
  if (game.hands[0].cards.length > 0 && game.hands[1].cards.length > 0) {
    game.flipCards();

    game.stage = [];
  } else {
    alert("Game Over!");
  }
  game.updateRemainingCards();
});

game.playUpdates("The deck has been shuffled and dealt. CLICK the player deck to flip the cards!");
