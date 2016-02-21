// start with High Card
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
var suits = ["clubs", "diamonds", "hearts", "spades"];

var game = {
  deck: [],
  hand: [],

  newDeck: function() {
    var self = this;
    values.forEach(function(value) {
      suits.forEach(function(suit) {
        self.deck.push(value + " " + suit);
      });
    });
  },

  shuffleDeck: function() {
    // Fisher-Yates shuffle
    for (var i = this.deck.length - 1; i > 0; i--) {
      var randomIndex = Math.floor(Math.random() * 52);
      var hold = this.deck[i];
      this.deck[i] = this.deck[randomIndex];
      this.deck[randomIndex] = hold;
    }
  }
};
