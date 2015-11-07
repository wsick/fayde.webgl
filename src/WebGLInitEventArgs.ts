module Fayde.WebGL {
    export class WebGLInitEventArgs implements nullstone.IEventArgs {
        rend: WebGLRenderer;

        constructor(rend: WebGLRenderer) {
            Object.defineProperties(this, {
                "rend": {value: rend, writable: false}
            });
        }
    }
}