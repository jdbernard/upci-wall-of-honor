declare module 'spark-md5' {
  export default class SparkMD5 {
    constructor();
    append(str: string): void;
    appendBinary(str: string): void;
    getState(): object;
    setState(state: object): void;
    reset(): void;
    destroy(): void;
    end(raw?: boolean): string;
    static hash(str: string, raw?: boolean): string;
    static hashBinary(str: string, raw?: boolean): string;
    static ArrayBuffer: {
      hash(ab: ArrayBuffer, raw?: boolean): string;
    };
  }
}
