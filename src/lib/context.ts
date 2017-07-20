/**
 * Context (Scope): Used for Semantic Analyze
 */
export interface ContextItem {
    type: string;
    const: boolean;
    array: boolean;
    arraySizes?: number[];
    func: boolean;
    funcTypes?: string[];
}
export default class Context {
    constructor(parent: Context | null) {
        if (parent) {
            this.parent = parent;
        }
    }
    find(name: string): ContextItem | null {
        let p: Context = this;
        while (true) {
            let t = p.content.get(name);
            if (t) {
                return t;
            }
            if (p.parent) {
                p = p.parent;
            } else {
                break;
            }
        }
        return null;
    }
    parent: Context | null = null;
    content: Map<string, ContextItem> = new Map();
}
