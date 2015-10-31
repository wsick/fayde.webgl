module fayde.webgl.updater.measure.tapins {
    export function doOverride(input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, availableSize: Size): boolean {
        var available = state.availableSize;
        var desired = output.desiredSize;
        desired.width = desired.height = 0;
        return true;
    }
}