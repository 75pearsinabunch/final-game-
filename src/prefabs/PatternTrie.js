class TrieNode {
  constructor(slots) {
    this.children = new Array(slots + 1);
    this.children[slots] = true;//stopper is false
  }
}

class PatternTrie {
  //slots: the number of elements tracked by nodes
  constructor(slots, controller, scene) {
    this.root = new TrieNode(slots);//1 space for stopper
    this.slots = slots;//for use in other functions
    this.stopI = slots;
    this.scene = scene;
    this.iC = controller;
  }

  //Traverses a given pattern. If it's interrupted decider determines result
  checkPattern(hand) {
    this.currRoot = this.root;//doing it iteratively, nothing fancy
    this.tempRoot = undefined;
    for (let i = 0; i < hand.length; i++) {
      this.chI = this.getChildIndex(hand[i]);
      this.tempRoot = this.currRoot.children[this.chI];
      //check for existance
      if (this.tempRoot == undefined || !this.tempRoot.children[this.chI]) {
        //make the thing we tried to land on not an option for continuity
        this.tempRoot = new TrieNode(this.slots);
        this.tempRoot.children[this.stopI] = false;
        return this.sprout(this.currRoot, (i - 3));//credit the remaining to make a tree
      }

      this.currRoot = this.tempRoot;//continue iteration
    }
    //close off this path
    this.currRoot.children[this.stopI] = false;

    //checks to see if this is a valid stopping point
    return true;
  }

  //generates a node structure based off of given input
  //node: the last node reached before termination
  sprout(node, credits = 0) {
    let avNodes = node.children;
    for (let i = 0; i < credits; i++) {
      for (let j = 0; i < avNodes.length; i++) {
        if (avNodes[this.stopI]) {
          avNodes.splice(j, 1);//remove from list of possiblilites
        }
      }
      let ind = Phaser.Math.Between[0, avNodes.length - 1];
      avNodes[ind] = new TrieNode(this.slots);
    }

    //num to right of 0 is magic, empirically decided
    if (Phaser.Math.Between(0,3) == 0) {
      return true;
    }
    return false;
  }

  //determines the index a node's child should be based on the kind 
  //of input recieved
  getChildIndex(card) {
    if (typeof (card) == 'string') {
      return suits.indexOf(card - 1);//returns index based on place in global index
    }
    return (card - 1);//just return the value
  }

  //A testing function to determine the structure of a trie
  printTrie(node) {
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i] != undefined) {
        this.printTrie(node.children[i]);
      }
    }
  }

}
