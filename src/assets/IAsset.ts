module Fayde.WebGL {
    export interface IAsset {
        load(rend: WebGLRenderer);
        bindAttribute(rend: WebGLRenderer, attr: WebGLAttribute);
    }
}