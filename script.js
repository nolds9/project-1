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
    var self = this;
    this.stage.sort(function(a, b) {
      return b.card.weight - a.card.weight;
    });

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
    updateRemaining();
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
    flipCards();
    game.stage = [];
  } else {
    alert("Game Over!");
  }
  updateRemaining();
});

function flipCards() {
  game.cardsToStage();
  showCards();
  if (buildWarStage()) {
    warWinner();
    for (var x = 0; x < game.war.length; x++){
      if (game.hands[x].name === game.war[0].player) {
        for (var y = 0; y < 4; y++) {
          game.hands[x].cards.unshift(game.war[0].cards[y]);
          game.hands[x].cards.unshift(game.war[1].cards[y]);
        }
      }
    }
    game.war = [];
  }
  game.getWinner();
  var winner = game.stage[0].player;
  for (var i = 0; i < game.stage.length; i++) {
    for (var j = 0; j < game.hands.length; j++) {
      if (game.hands[j].name === winner) {
        game.hands[j].cards.unshift(game.stage[i].card);
      }
    }
  }
}

function showCards() {
  for (var i = 0; i < 2; i++) {
    var stageCard = document.createElement("div");
    stageCard.setAttribute("class","stage-card");
    stagingArea.appendChild(stageCard);
    stageCard.innerText = game.stage[i].card.value + "\n";
    stageCard.innerText += game.stage[i].card.suit;
    stageCard.style.fontSize = "48px";
    setTimeout(function () {
      var cards = document.querySelectorAll(".stage-card");
      for (var i = 0; i < cards.length; i++) {
        stagingArea.removeChild(cards[i]);
      }
    }, 2000);
  }
}

function buildWarStage() {
  // IF the card weight is equal
  // go back 4 indexes in hands
  // compare again
  // IF equal go back 4 more indexes and compare again
  // repeat until someone wins
  // all cards go to winners hand
  if (game.stage[0].card.weight === game.stage[1].card.weight) {
    game.stage.forEach(function(i) {
      game.war.push({player: i.player, cards: []});
    });
    game.hands.forEach(function(i) {
      if (i.name === game.war[0].player) {
        for (var j = 0; j < 4; j++) {
          game.war[0].cards.push(i.cards.pop());
        }
      } else if (i.name === game.war[1].player) {
        for (var k = 0; k < 4; k++) {
          game.war[1].cards.push(i.cards.pop());
        }
      }
    });
  }
  return true;
}

function warWinner() {
  game.war.sort(function(a, b) {
    return b.cards[3].weight - a.cards[3].weight;
  });
}

function updateRemaining() {
  var playerRemaining = document.querySelector(".remaining .player");
  var computerRemaining = document.querySelector(".remaining .computer");

  playerRemaining.innerHTML = "Remaining Cards: " + game.hands[0].cards.length;
  computerRemaining.innerHTML = "Remaining Cards: " + game.hands[1].cards.length;
}
