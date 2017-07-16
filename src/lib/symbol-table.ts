/**
 * Symbol Table
 * Find Symbol By NAME
 */
interface ISymbol {

}

export default class SymbolTable {
    index: Map<string, ISymbol> = new Map();
}