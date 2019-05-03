type Mutable<T> = { -readonly [P in keyof T]: T[P] };

declare module "automerge" {
  export interface Change {
    message: string;
  }

  export interface HistoryEntry<T> {
    change: Change;
    snapshot: Readonly<T>;
  }

  export function init<T extends object>(actorId?: string): Readonly<T>;
  export function change<T extends object>(
    doc: Readonly<T>,
    description: string,
    changeHandler: (doc: Mutable<T>) => void
  ): Readonly<T>;
  export function emptyChange<T extends object>(
    doc: Readonly<T>,
    description: string
  ): Readonly<T>;
  export function undo<T extends object>(
    doc: Readonly<T>,
    description: string
  ): Readonly<T>;
  export function redo<T extends object>(
    doc: Readonly<T>,
    description: string
  ): Readonly<T>;
  export function load<T extends object>(
    jsonString: string,
    actorId?: string
  ): Readonly<T>;
  export function save<T extends object>(doc: Readonly<T>): string;
  export function merge<T extends object>(
    localDoc: Readonly<T>,
    remoteDoc: Readonly<T>
  ): Readonly<T>;
  export function diff(...args: any): any;
  export function getChanges<T extends object>(
    oldDoc: Readonly<T>,
    newDoc: Readonly<T>
  ): Change[];
  export function applyChanges(...args: any): any;
  export function getMissingDeps(...args: any): any;
  export function equals(a: any, b: any): boolean;
  export function getHistory<T>(doc: T): HistoryEntry<T>[];
  export function uuid(): string;
  // export const Frontend: {};
  // export const Backend: {};
  export class DocSet<T extends object> {
    constructor();

    readonly docIds: IterableIterator<string>;

    getDoc(docId: string): Readonly<T>;

    setDoc(docId: string, doc: Readonly<T>): void;

    applyChanges(docId: string, changes: Change[]): Readonly<T>;

    registerHandler(handler: (docId: string, doc: Readonly<T>) => void): void;

    unregisterHandler(handler: (docId: string, doc: Readonly<T>) => void): void;
  }
  export class WatchableDoc {}
  export class Connection<T extends object> {
    constructor(docSet: DocSet<T>, sendMsg: (msg: unknown) => void);

    open(): void;

    close(): void;

    receiveMsg(msg: unknown): Readonly<T>;

    maybeSendChanges(docId: string): void;

    private sendMsg(docId: string, clock: unknown, changes?: Change[]): void;
    private docChanged(docId: string, doc: Readonly<any>): void;
  }

  export function canUndo(...args: any): any;
  export function canRedo(...args: any): any;
  export function getObjectId(...args: any): any;
  export function getObjectById(...args: any): any;
  export function getActorId(...args: any): any;
  export function setActorId(...args: any): any;
  export function getConflicts(...args: any): any;

  // FIXME: extending Array<string> doesn't grant it these methods
  // automatically, so they're added in manually from lib.d.ts. not ideal --
  // error-prone and hard to maintain.
  export class Text /* extends Array<string> */ {
    insertAt(index: number, ...values: string[]): this;
    deleteAt(index: number, numDelete: number): this;

    pop(): string | undefined;
    /**
     * Appends new elements to an array, and returns the new length of the array.
     * @param items New elements of the Array.
     */
    push(...items: string[]): number;
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat(...items: ConcatArray<string>[]): string[];
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat(...items: (string | ConcatArray<string>)[]): string[];
    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    fill(value: string, start: number, end: number): this;

    shift(): string | undefined;

    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     */
    splice(start: number, deleteCount?: number): string[];
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the array in place of the deleted elements.
     */
    splice(start: number, deleteCount: number, ...items: string[]): string[];

    /**
     * Inserts new elements at the start of an array.
     * @param items  Elements to insert at the start of the Array.
     */
    unshift(...items: string[]): number;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;
    /**
     * Returns a string representation of an array. The elements are converted to string using their toLocalString methods.
     */
    toLocaleString(): string;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    slice(start?: number, end?: number): string[];

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    indexOf(searchElement: string, fromIndex?: number): number;
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    lastIndexOf(searchElement: string, fromIndex?: number): number;
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    every(
      callbackfn: (value: string, index: number, array: string[]) => boolean,
      thisArg?: any
    ): boolean;
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    some(
      callbackfn: (value: string, index: number, array: string[]) => boolean,
      thisArg?: any
    ): boolean;
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(
      callbackfn: (value: string, index: number, array: string[]) => void,
      thisArg?: any
    ): void;
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(
      callbackfn: (value: string, index: number, array: string[]) => U,
      thisArg?: any
    ): U[];

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(
      callbackfn: (value: string, index: number, array: string[]) => any,
      thisArg?: any
    ): string[];
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce(
      callbackfn: (
        previousValue: string,
        currentValue: string,
        currentIndex: number,
        array: string[]
      ) => string
    ): string;
    reduce(
      callbackfn: (
        previousValue: string,
        currentValue: string,
        currentIndex: number,
        array: string[]
      ) => string,
      initialValue: string
    ): string;
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduce<U>(
      callbackfn: (
        previousValue: U,
        currentValue: string,
        currentIndex: number,
        array: string[]
      ) => U,
      initialValue: U
    ): U;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight(
      callbackfn: (
        previousValue: string,
        currentValue: string,
        currentIndex: number,
        array: string[]
      ) => string
    ): string;
    reduceRight(
      callbackfn: (
        previousValue: string,
        currentValue: string,
        currentIndex: number,
        array: string[]
      ) => string,
      initialValue: string
    ): string;
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    reduceRight<U>(
      callbackfn: (
        previousValue: U,
        currentValue: string,
        currentIndex: number,
        array: string[]
      ) => U,
      initialValue: U
    ): U;
  }
  export function Table(...args: any): any;
  export function Counter(...args: any): any;
}
