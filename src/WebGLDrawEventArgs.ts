module Fayde.WebGL {
    export class WebGLDrawEventArgs implements nullstone.IEventArgs {
        rend: WebGLRenderer;

        constructor(rend: WebGLRenderer) {
            Object.defineProperties(this, {
                "rend": {value: rend, writable: false}
            });
        }
    }
}