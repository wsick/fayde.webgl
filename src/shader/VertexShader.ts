/// <reference path="ShaderBase" />

module Fayde.WebGL {
    export class VertexShader extends ShaderBase {
        protected getType(gl: WebGLRenderingContext): number {
            return gl.VERTEX_SHADER;
        }
    }
}