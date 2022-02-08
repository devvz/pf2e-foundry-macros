if(args[0] === "off"){
    return
}
 
let error = false;
if(!(game.modules.get("jb2a_patreon"))){
    error = `You need to have JB2A installed to run this macro!`;
}
 
if(!game.modules.get("warpgate")?.active){
    let installed = game.modules.get("warpgate") && !game.modules.get("warpgate").active ? "enabled" : "installed";
    error = `You need to have WarpGate ${installed} to run this macro!`;
}
 
const tokenD = canvas.tokens.controlled[0];
 
if(!tokenD){
    error = `Could not find the token to teleport!`;
}
 
if(error){
    ui.notifications.error(error);
    return;
}

//*                                                         *//

let range = await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
    t: "circle",
    user: game.user.id,
    x: tokenD.x + canvas.grid.size / 2,
    y: tokenD.y + canvas.grid.size / 2,
    direction: 0,
    distance: 40,
    borderColor: "#FF0000"
}]);
 
let position = await warpgate.crosshairs.show({
    size: 1,
    tag: randomID(),
    label: "Sudden Charge to",
    drawOutline: false,
    drawIcon: false
}, { show: async (crosshair) => {
 
    new Sequence()
        .effect()
            .from(tokenD)
            .attachTo(crosshair)
            .persist()
            .opacity(0.5)
            .name(`${tokenD.data.name}- Sudden Charge -${tokenD.data._id}`)
        .play();
 
}})

await Sequencer.Preloader.preloadForClients([
    "jb2a.misty_step.02.orange",
    "jb2a.shield_themed.above.fire.01.orange",
    "jb2a.ground_cracks.orange.03",
    "jb2a.shield_themed.below.fire.03.orange"
], false)

await range[0].delete();
// await Sequencer.EffectManager.endEffects({`${tokenD.data.name}- Sudden Charge -${tokenD.data._id}`});

new Sequence()
    .effect()
        .file("autoanimations.static.boulderimpact.01.white.0")
        .atLocation(tokenD)
        .randomRotation()
        .scaleToObject(2)
    .wait(350)
    .animation()
        .on(tokenD)
        .opacity(0.0)
        .rotateTowards(position)
        .waitUntilFinished()
    .effect()
        .file("jb2a.gust_of_wind.veryfast")
        .atLocation(tokenD)
        .stretchTo(position)
    .animation()
        .on(tokenD)
        .teleportTo(position)
        .snapToGrid()
    .wait(100)
    .effect()
        .file("jb2a.impact.009.white")
        .atLocation(tokenD)
        .randomRotation()
        .scaleToObject(2)
        .waitUntilFinished(-2500)
    .effect()
        .file("jb2a.impact.ground_crack.orange.02")
        .atLocation(tokenD)
        .randomRotation()
        .belowTokens()
        .scaleToObject(2)
    .animation()
        .on(tokenD)
        .opacity(1.0)
    .play();