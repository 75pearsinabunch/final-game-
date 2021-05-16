class TrieNode {
  constructor(slots) {
    this.children = new Array(slots);
    //console.log(this.children);
    this.children[this.stopI] = false;//stopper is false
  }
}

class PatternTrie {
  //slots: the number of elements tracked by nodes
  constructor(slots) {
    this.root = new TrieNode(slots + 1);//1 space for stopper
    this.slots = slots;//for use in other functions
    this.stopI = slots;
  }

  //adds a given pattern to the trie node
  addPattern(hand) {
    //console.log("PatternTrie, addPatern: starting");
    this.currRoot = this.root;//doing it iteratively, nothing fancy
    this.tempRoot = undefined;
    for (let i = 0; i < hand.length; i++) {
      //console.log("PatternTrie, addPatern: card input: " + hand[i]);
      this.chI = this.getChildIndex(hand[i])
      //console.log("PatternTrie, addPatern: index determined: " + this.chI);
      this.tempRoot = this.currRoot.children[this.chI];//check for existance
      if (this.tempRoot == undefined) {
        //console.log("PatternTrie, addPatern: temp root undefined, creating new");
        this.currRoot.children[this.chI] = new TrieNode(this.slots);
        this.tempRoot = this.currRoot.children[this.chI];
      }
      this.currRoot = this.tempRoot;
    }
    this.currRoot.children[this.stopI] = true;
    //console.log("PatternTrie, addPatern: ended");
    //this.printTrie(this.root);
  }

  //Returns true if the pattern exists, false if it does not
  checkPattern(hand) {
    console.log("PatternTrie, checkPattern: starting");
    this.currRoot = this.root;//doing it iteratively, nothing fancy
    this.tempRoot = undefined;
    for (let i = 0; i < hand.length; i++) {
      this.chI = this.getChildIndex(hand[i]);
      this.tempRoot = this.currRoot.children[this.chI];//check for existance
      if (this.tempRoot == undefined) {
        console.log("couldn't find pattern")
        return false;
      }
      this.currRoot = this.tempRoot;
    }

    //checks to see if this is a valid stopping point
    if (this.currRoot.children[this.stopI]) {
      return true;
    }

    return false;
    //console.log("PatternTrie, addPatern: ended");
    //this.printTrie(this.root);
  }

  removePattern() {
    console.log("PatternTrie, removePattern: starting");
    this.currRoot = this.root;//doing it iteratively, nothing fancy
    this.tempRoot = undefined;
    for (let i = 0; i < hand.length; i++) {
      this.chI = this.getChildIndex(hand[i]);
      this.tempRoot = this.currRoot.children[this.chI];//check for existance
      if (this.tempRoot == undefined) {
        console.log("PatternTrie, removePattern: patttern never existed")
        return;
      }
      this.currRoot = this.tempRoot;
    }

    //checks to see if this is a valid stopping point
    this.currRoot.children[this.stopI] = false;

    console.log("PatternTrie, removePattern: ended");
    //this.printTrie(this.root);
  }

  //determines the index a node's child should be based on the kind 
  //of input recieved
  getChildIndex(card) {
    if (typeof (card) == 'string') {
      return suits.indexOf(card);//returns index based on place in global index
    }
    return card;//just return the value
  }

  //A testing function to determine the structure of a trie
  printTrie(node) {
    console.log(node.children);
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i] != undefined) {
        this.printTrie(node.children[i]);
      }
    }
  }

}