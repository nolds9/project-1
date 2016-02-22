var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var suits = ["clubs", "diamonds", "hearts", "spades"];

var game = {
  deck: [],
  hands: [],
  players: ["Player 1", "Player 2"],
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

  getWinner: function() {
    // compare the last card in each players hand
    for (var i = 0; i < this.players.length; i++) {
      this.stage.push({player: this.players[i], card: this.hands[i].cards[this.hands[i].cards.length - 1]});
    }
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
game.getWinner();

  var flipButton = document.getElementById("flip");
  flipButton.addEventListener("click", flipCards);


function flipCards() {
    var message = "";
    game.stage.forEach(function(i) {
      message += i.player + " had the " + i.card.value + " of " + i.card.suit + "\n";
    });
    alert(message);
}
