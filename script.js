var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var suits = ["clubs", "diamonds", "hearts", "spades"];

var game = {
  deck: [],
  hands: [],
  players: ["Player 1", "Computer"],
  stage: [],
  war: [],

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
      this.stage.forEach(function(i) {
        self.war.push({player: i.player, cards: []});
      });
      this.hands.forEach(function(i) {
        if (i.name === self.war[0].player) {
          for (var j = 0; j < 4; j++) {
            self.war[0].cards.push(i.cards.pop());
          }
        } else if (i.name === self.war[1].player) {
          for (var k = 0; k < 4; k++) {
            self.war[1].cards.push(i.cards.pop());
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
    console.log(game.war[0]);
    console.log(game.war[1]);
  },

  showCards: function() {
    for (var i = 0; i < 2; i++) {
      var stageCard = document.createElement("div");
      stageCard.setAttribute("class","stage-card");
      stagingArea.appendChild(stageCard);
      stageCard.innerText = this.stage[i].card.value + "\n";
      stageCard.innerText += this.stage[i].card.suit;
      stageCard.style.fontSize = "48px";
      setTimeout(function () {
        var cards = document.querySelectorAll(".stage-card");
        for (var i = 0; i < cards.length; i++) {
          stagingArea.removeChild(cards[i]);
        }
      }, 500);
    }
  },

  flipCards: function() {
    this.cardsToStage();
    this.showCards();
    if (this.buildWarStage()) {
      this.warWinner();
      if (this.war[0].player === this.hands[0].name) {
        for (var y = 0; y < 4; y++) {
          this.hands[0].cards.unshift(this.war[0].cards[y]);
          this.hands[0].cards.unshift(this.war[1].cards[y]);
        }
      } else if (this.war[0].player === this.hands[1].name) {
        for (var x = 0; x < 4; x++) {
          this.hands[1].cards.unshift(this.war[0].cards[x]);
          this.hands[1].cards.unshift(this.war[1].cards[x]);
        }
      }
      var winsWar = this.war[0].player;
      for (var a = 0; a < this.stage.length; a++) {
        for (var b = 0; b < this.hands.length; b++) {
          if (this.hands[b].name === winsWar) {
            this.hands[b].cards.unshift(this.stage[a].card);
          }
        }
      }
      this.war = [];
    } else {
      this.getWinner();
      var winner = this.stage[0].player;
      for (var i = 0; i < this.stage.length; i++) {
        for (var j = 0; j < this.hands.length; j++) {
          if (this.hands[j].name === winner) {
            this.hands[j].cards.unshift(this.stage[i].card);
          }
        }
      }
    }
  },

  updateRemaining: function() {
    var playerRemaining = document.querySelector(".remaining .player");
    var computerRemaining = document.querySelector(".remaining .computer");

    playerRemaining.innerHTML = "Remaining Cards: " + this.hands[0].cards.length;
    computerRemaining.innerHTML = "Remaining Cards: " + this.hands[1].cards.length;
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
    this.updateRemaining();
  }
};

game.newDeck();
game.shuffleDeck();
game.setUpHands();
game.dealCards();

var resetButton = document.getElementById("reset");
var flipButton = document.getElementById("flip");
var stagingArea = document.querySelector(".stage-area");

resetButton.addEventListener("click", function() {
  game.reset();
});

flipButton.addEventListener("click", function() {
  if (game.hands[0].cards.length > 0 && game.hands[1].cards.length > 0) {
    game.flipCards();
    game.stage = [];
  } else {
    alert("Game Over!");
  }
  game.updateRemaining();
});
