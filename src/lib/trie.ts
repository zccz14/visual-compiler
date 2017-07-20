/**
 * Trie Tree
 */
class TrieNode {
  
}

class Trie {
  root = {};
  add(str: string) {
    let ptr = this.root;
    for (let ch of str) {
      if (ptr[ch] === undefined) {
        ptr[ch] = {};
      }
      ptr = ptr[ch];
    }
    ptr['done'] = true;
  }
}