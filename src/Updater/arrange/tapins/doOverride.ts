module fayde.webgl.updater.arrange.tapins {
    export function doOverride (input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, finalRect: Rect): boolean {
        var cr = state.childRect;
        Size.copyTo(state.finalSize, state.arrangedSize);
        return true;
    }
}