module Fayde.WebGL {
    export class WebGLDrawEventArgs implements nullstone.IEventArgs {
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        width: number;
        height: number;

        constructor(gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number) {
            Object.defineProperties(this, {
                "gl": {value: gl, writable: false},
                "program": {value: program, writable: false},
                "width": {value: width, writable: false},
                "height": {value: height, writable: false}
            });
        }
    }
}