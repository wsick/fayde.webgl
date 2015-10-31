module fayde.webgl.updater.render.tapins {
    export function doRender(input: IInput, state: minerva.core.render.IState, output: minerva.core.render.IOutput, ctx: minerva.core.render.RenderContext, region: Rect, tree: minerva.core.IUpdaterTree): boolean {
        var source = input.source;
        if (!source)
            return true;

        ctx.save();
        minerva.core.helpers.renderLayoutClip(ctx, input, tree);
        source.draw(ctx.raw);
        ctx.restore();

        return true;
    }
}