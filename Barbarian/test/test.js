const _placeCircle = async (options) => {

    const mouse = canvas.app.renderer.plugins.interaction.mouse;
    const position = mouse.getLocalPosition(canvas.app.stage);
    const templateData = {
        ...options,
        ...position,
    }

    let template = (await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [templateData]))[0];

    const updateTemplateLocation = async (crosshairs) => {
        while (crosshairs.inFlight) {
            await warpgate.wait(100);

            if (template.data.x === crosshairs.center.x && template.data.y === crosshairs.center.y) {
                continue;
            }

            template = await template.update(crosshairs.center);
        }
    };

    const targetConfig = {
        drawIcon: false,
        drawOutline: false,
        interval: 1,
    };
    const ch = await warpgate.crosshairs.show(
        targetConfig,
        {
            show: updateTemplateLocation
        }
    );

    if (ch.cancelled) {
        await template.delete();
        return;
    }

    return template;
};