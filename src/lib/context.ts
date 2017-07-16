/**
 * Context (Scope): Used for Semantic Analyze
 */
export default class Context {
    constructor(parent: Context | null) {
        if (parent) {
            this.parent = parent;
        }
    }
    parent: Context | null = null;
    content: Map<string, {const: boolean, type: string}> = new Map();
}
