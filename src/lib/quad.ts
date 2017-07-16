import { IIntermediate } from "./compiler";
/**
 * 四元式
 */
export default class Quad implements IIntermediate {
    constructor(op: string, src1: string, src2: string, dest: string | number) {
        this.op = op;
        this.src1 = src1;
        this.src2 = src2;
        this.dest = dest;
    }
    op: string;
    src1: string;
    src2: string;
    dest: string | number;
}

export function merge(list: Quad[], head1: number, head2: number): number {
    if (!head2) {
        return head1;
    }
    let p = head2;
    while (true) {
        console.log('merge', p);
        if (list[p - 1].dest) {
            p = <number>list[p - 1].dest;
        } else {
            list[p - 1].dest = head1;
            break;
        }
    }
    return head2;
}

export function backpatch(list: Quad[], head: number, value: number): void {
    while (head) {
        console.log(head);
        let t = head; 
        head = <number>list[head - 1].dest;
        list[t - 1].dest = value;
    }
}