// requires Warpgate, Sequencer, and JB2A patreon module
 
const tokenD = canvas.tokens.controlled[0];

//*                                                         *//
// declare variables

// const distanceAvailable = 30;
// effect name to easily cancel all effects
var effectName = `${tokenD.data.name}-timewarp-${tokenD.data._id}`;
// effects array to preload
let effectArray = [
    'jb2a.energy_conduit.bluepurple.circle.01',
    'jb2a.energy_beam.normal.blue.01',
    'jb2a.energy_beam.normal.bluepink.02'
];
// preload effects for clients
await Sequencer.Preloader.preloadForClients(effectArray, false);
 
let position = await warpgate.crosshairs.show({
    size: 1,
    interval: -1,
    tag: randomID(),
    rememberControlled: true,
    label: "Time Warp to",
    drawOutline: true,
    drawIcon: false
}, { show: async (crosshair) => {

    new Sequence()
        .effect()
            .from(tokenD)
            .attachTo(crosshair)
            .persist()
            .opacity(0.65)
            .name('tempIcon')
        // stretch effect from token to cursor
        // not sure how to calculate length needed
        .effect()
            .atLocation(tokenD)
            .stretchTo(crosshair, { attachTo: true })
            .file("jb2a.energy_beam.normal.blue.01")
            .persist()
            .name('tempIcon')
        .play();
 
}})

if (position.cancelled) {
    Sequencer.EffectManager.endEffects({ name: 'tempIcon' });
    ui.notifications.error("Cancelled Time Jump!");
    return;
}

// await range[0].delete();
await Sequencer.EffectManager.endEffects({effectName});

new Sequence()
    .effect()
        .file("jb2a.energy_conduit.bluepurple.circle.01")
        .atLocation(tokenD)
        .stretchTo(position)
        .duration(1000)
        .scaleIn(0, 500, {ease: "easeOutCubic"})
        .fadeOut(500)
        .name(effectName)
    .wait(250)
    .effect()
        .file("jb2a.energy_beam.normal.bluepink.02")
        .atLocation(tokenD)
        .stretchTo(position)
        .duration(750)
        .scale(0.6)
        .scaleIn(0, 500, {ease: "easeOutCubic"})
        .fadeOut(500)
        .name(effectName)
    .wait(350)
    .animation()
        .on(tokenD)
        .fadeOut(200)
        .rotateTowards(position)
        .waitUntilFinished()
    .animation()
        .on(tokenD)
        .fadeIn(200)
        .teleportTo(position)
        .snapToGrid()
    .play();