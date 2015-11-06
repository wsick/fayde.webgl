module Fayde.WebGL {
    export class WebGLInitEventArgs implements nullstone.IEventArgs {
        gl: WebGLRenderingContext;
        program: WebGLProgram;

        constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
            Object.defineProperties(this, {
                "gl": {value: gl, writable: false},
                "program": {value: program, writable: false}
            });
        }
    }
}