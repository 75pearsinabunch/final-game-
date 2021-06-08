/*
An explaination of the trie system:
This data structure "remembers" player movements
and adjusts "correct" movements based on them

Players make a move, and if it is incorrect, several "correct" solutions
are made nearby it. 

however, these solutions can become used up.

The result of this is that players suddenly find themselves with solution
tenuously in hand, but as their possible solutions dwindle they are left
yet again clueless and frustrated 

This design is intentional to match with Prof Swensen's challenge to make
the game flip player's perspectives. In this case it is from confused to
pretty sure they are in control, to confused again. 
*/

//Develops a trie-node structure that permits successful use of all
//possibilites developed from that point
class TrieNode {
  constructor(slots) {
    this.children = new Array(slots + 1);
    //randomly generate if this child will be a valid path link
    this.children[slots] = true;
    //this instantiates with all child possibilites as acceptable
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
    this.bud(this.root);
  }

  //Traverses a given pattern. If it's interrupted decider determines result
  checkPattern(hand) {
    this.currRoot = this.root;
    this.tempRoot = undefined;
    for (let i = 0; i < hand.length; i++) {//basically always 0-2
      this.chI = this.getChildIndex(hand[i]);
      this.tempRoot = this.currRoot.children[this.chI];
      //in the case that the root searched for doesn't exist

      if (this.tempRoot == undefined) {
        this.bud(this.currRoot);
        this.tempRoot = this.currRoot.children[this.chI];
        if(i == 2){
          this.tempRoot.children[this.stopI] = false;
        }
      }

      if (!this.tempRoot.children[this.stopI]) {
        return false;
      }
      this.currRoot = this.tempRoot;//continue iteration
    }

    this.result = this.currRoot.children[this.stopI];
    //close off this path
    this.currRoot.children[this.stopI] = false;

    //checks to see if this is a valid stopping point
    return this.result;
  }

  //recursive function that creates branches off a given starting node
  //generates a node structure based off of given input
  //node: the last node reached before termination
  bud(node) {
    for (let j = 0; j < node.children.length - 1; j++) {//fill each slot w/ new possiblities
      if (node.children[j] == undefined) {
        node.children[j] = new TrieNode(this.slots);
      }
    }
  }

  //determines the index a node's child should be based on the kind 
  //of input recieved
  getChildIndex(card) {
    if (typeof (card) == 'string') {
      return suits.indexOf(card - 1);//returns index based on place in global index
    }
    return (card - 1);//just return the value
  }

}
