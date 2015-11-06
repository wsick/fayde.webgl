module Fayde.WebGL {
    export interface IShader {
        load(forceLoad?: boolean): Promise<IShader>;
        compile(gl: WebGLRenderingContext): boolean;
        use(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}