var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var suits = ["clubs", "diamonds", "hearts", "spades"];

var game = {
  deck: [],
  hands: [],
  players: ["Player 1", "Computer"],
  stage: [],

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
    // put the top card in each players hand to the staging area and compare
    for (var i = 0; i < this.players.length; i++) {
      this.stage.push({player: this.players[i], card: this.hands[i].cards.pop()});
    }
  },

  getWinner: function() {
    var self = this;
    this.stage.sort(function(a, b) {
      return b.card.weight - a.card.weight;
    });
  }
};

game.newDeck();
game.shuffleDeck();
game.setUpHands();
game.dealCards();
// game.cardsToStage();

// function createStage() {
//   // target each hand div then append child (stage) to that div
//   var handDivs = document.querySelectorAll(".hand");
//   for (var i = 0; i < handDivs.length; i++) {
//     var stagedCard = document.createElement("div").setAttribute("class", "stage");
//     console.log(handDivs[i]);
//     handDivs[i].appendChild(stagedCard);
//   }
// }

var flipButton = document.getElementById("flip");
var stagingArea = document.querySelector(".stage-area");
flipButton.addEventListener("click", function() {
  if (game.hands[0].cards.length > 0 && game.hands[1].cards.length > 0) {
  flipCards();
  game.stage = [];
} else {
  alert("Game Over!");
}
});


function flipCards() {
  game.cardsToStage();
  showCards();
  game.getWinner();
  var winner = game.stage[0].player;
  for (var i = 0; i < game.stage.length; i++) {
    for (var j = 0; j < game.hands.length; j++) {
      if (game.hands[j].name === winner) {
        game.hands[j].cards.unshift(game.stage[i].card);
      }
    }
  }
  console.log(game.hands[0].cards.length);
  // game.stage = [];
  // alert(message);
}

function showCards() {
  for (var i = 0; i < 2; i++) {
    var stageCard = document.createElement("div");
    stageCard.setAttribute("class","stage-card");
    stagingArea.appendChild(stageCard);
    //this is putting every high card on players side...
    stageCard.innerText = game.stage[i].card.value + " " + game.stage[i].card.suit;
    setTimeout(function () {
      var cards = document.querySelectorAll(".stage-card");
      for (var i = 0; i < cards.length; i++) {
        stagingArea.removeChild(cards[i]);
      }
    }, 2000);
    }
}

function checkTie() {
  // if the card weight is equal return card to players hand

}
