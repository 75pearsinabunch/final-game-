class TrieNode {
  constructor(slots) {
    this.children = new Array(slots + 1);
    this.children[slots] = true;//stopper is false
  }
}

class PatternTrie {
  //slots: the number of elements tracked by nodes
  constructor(slots,controller, scene) {
    this.root = new TrieNode(slots);//1 space for stopper
    this.slots = slots;//for use in other functions
    this.stopI = slots;
    this.scene = scene;
    this.iC = controller;
  }

  //Traverses a given pattern. If it's interrupted decider determines result
  checkPattern(hand) {
    console.log("PatternTrie, checkPattern: starting");
    this.currRoot = this.root;//doing it iteratively, nothing fancy
    this.tempRoot = undefined;
    for (let i = 0; i < hand.length; i++) {
      this.chI = this.getChildIndex(hand[i]);
      this.tempRoot = this.currRoot.children[this.chI];//check for existance
      if (this.tempRoot == undefined) {
        return this.decider(this.currRoot, i, hand);
      }

      if(!this.tempRoot.children[this.chI]){
        return this.decider(this.currRoot, i);
      }

      this.currRoot = this.tempRoot;
    }
    //close off this path
    this.currRoot.children[this.chI] = false;

    //checks to see if this is a valid stopping point
    return true;
  }

  decider(root, i, hand = undefined){
    //highest possible chance
    //Time may be too forgiving
    let cap = 100;
    let allowence = .95;//percentage that must be cleared
    //time quotient
    let tQ = (this.scene.gameTime*Math.PI/this.scene.totalTime*2);
    let currChance = (Math.sin(tQ)*cap);
    if(Phaser.Math.Between(currChance, cap)>cap*allowence || this.iC.timesTried%3 == 0){
    //decide whather to help or not
    //if hand was passed, only addPattern would need it
      if(hand == undefined){
        {
          this.addPattern(root, i, hand);
        }
      }else{
        {
          this.branch(root, i);
        }
      }
      return true;
    }
    return false;
  }

  //creates a new full branch off the slot just before a terminated point
  //used whenever a node not found or successfully found
  branch(node, currInd) {
    console.log("Branching out")
    this.currRoot = node;

    for (let i = currInd; i < 5; i++) {//iterate at max 5 times
      //set the possible slots array
      this.tempRoot = this.currRoot.children[Phaser.Math.Between(0, this.slots)];

      //player had better hope we find space
      if (this.tempRoot == undefined) {
        this.tempRoot = new TrieNode(this.slots);//create a new successful trie in its space
        this.currRoot = this.tempRoot;
      }

      //in the case of landing on a valid pre-existing path:
      if(this.tempRoot[this.stopI]){
        this.currRoot = this.tempRoot;//continue down that path
      }
    }
  }


  //supports player by adding their selection to the list of given nodes
  //much like branch(), but moves with the player
  //node must be a valid node
  addPattern(node, currInd, hand) {
    console.log("Adding Pattern");
    this.currRoot = node;//doing it iteratively, nothing fancy
    this.tempRoot = undefined;
    for (let i = currInd; i < hand.length; i++) {
      this.chI = this.getChildIndex(hand[i]);
      this.tempRoot = this.currRoot.children[this.chI];//check for existance
      
      if (this.tempRoot == undefined) {//create a new one if doesn't exist
        this.currRoot.children[this.chI] = new TrieNode(this.slots);
        this.tempRoot = this.currRoot.children[this.chI];
      }
      this.currRoot = this.tempRoot;
    }
    this.currRoot.children[this.stopI] = false;//still sets last node to false
  }

  //determines the index a node's child should be based on the kind 
  //of input recieved
  getChildIndex(card) {
    if (typeof (card) == 'string') {
      return suits.indexOf(card);//returns index based on place in global index
    }
    return (card - 1);//just return the value
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



  /* no longer using hard remove
    removePattern(hand) {
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
  */