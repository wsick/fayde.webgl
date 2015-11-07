module Fayde.WebGL {
    export class ArrayAsset implements IAsset {
        arr: any;
        size = 3;
        type = 0;
        normalized = false;
        stride = 0;
        offset = 0;
        buffer: WebGLBuffer;

        init(size?: number, type?: number, normalized?: boolean, stride?: number, offset?: number): ArrayAsset {
            this.size = size == null ? 3 : size;
            this.type = type || 0;
            this.normalized = normalized === true;
            this.stride = stride || 0;
            this.offset = offset || 0;
            return this;
        }

        fill(arr: number[]): ArrayAsset {
            this.arr = arr;
            return this;
        }

        load(rend: WebGLRenderer): ArrayAsset {
            var gl = rend.gl;
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.arr, gl.STATIC_DRAW);
            return this;
        }

        bindAttribute(rend: WebGLRenderer, attr: WebGLAttribute) {
            var gl = rend.gl;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.vertexAttribPointer(attr.Index, this.size, this.type, this.normalized, this.stride, this.offset);
        }
    }
}