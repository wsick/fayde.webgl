module Fayde.WebGL {
    export class Uint8ArrayAsset extends ArrayAsset {
        arr: Uint8Array;

        fill(arr: number[]) {
            this.arr = new Uint8Array(arr);
            return this;
        }
    }
    export class Uint8ClampedArrayAsset extends ArrayAsset {
        arr: Uint8ClampedArray;

        fill(arr: number[]) {
            this.arr = new Uint8ClampedArray(arr);
            return this;
        }
    }
    export class Int8ArrayAsset extends ArrayAsset {
        arr: Int8Array;

        fill(arr: number[]) {
            this.arr = new Int8Array(arr);
            return this;
        }
    }
    export class Uint16ArrayAsset extends ArrayAsset {
        arr: Uint16Array;

        fill(arr: number[]) {
            this.arr = new Uint16Array(arr);
            return this;
        }
    }
    export class Int16ArrayAsset extends ArrayAsset {
        arr: Int16Array;

        fill(arr: number[]) {
            this.arr = new Int16Array(arr);
            return this;
        }
    }
    export class Uint32ArrayAsset extends ArrayAsset {
        arr: Uint32Array;

        fill(arr: number[]) {
            this.arr = new Uint32Array(arr);
            return this;
        }
    }
    export class Int32ArrayAsset extends ArrayAsset {
        arr: Int32Array;

        fill(arr: number[]) {
            this.arr = new Int32Array(arr);
            return this;
        }
    }
    export class Float32ArrayAsset extends ArrayAsset {
        arr: Float32Array;

        fill(arr: number[]) {
            this.arr = new Float32Array(arr);
            return this;
        }
    }
    export class Float64ArrayAsset extends ArrayAsset {
        arr: Float64Array;

        fill(arr: number[]) {
            this.arr = new Float64Array(arr);
            return this;
        }
    }
}