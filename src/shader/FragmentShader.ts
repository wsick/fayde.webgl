/// <reference path="ShaderBase" />

module Fayde.WebGL {
    export class FragmentShader extends ShaderBase {
        protected getType(gl: WebGLRenderingContext): number {
            return gl.FRAGMENT_SHADER;
        }
    }
}