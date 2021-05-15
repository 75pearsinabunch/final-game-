class TrieNode{
  constructor(){
    console.log("TrieNode constructed");
    this.children = [];
  }
}

class PatternTrie{
  constructor(){
    console.log("Pattern Trie constructed");
    this.root = new TrieNode();
  }
}