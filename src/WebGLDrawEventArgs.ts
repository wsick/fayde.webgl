module Fayde.WebGL {
    export class WebGLDrawEventArgs implements nullstone.IEventArgs {
        gl: WebGLRenderingContext;
        width: number;
        height: number;

        constructor(gl: WebGLRenderingContext, width: number, height: number) {
            Object.defineProperties(this, {
                "gl": {value: gl, writable: false},
                "width": {value: width, writable: false},
                "height": {value: height, writable: false}
            });
        }
    }
}