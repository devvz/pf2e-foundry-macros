// shocking grasp

// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- LightningBolt -${tokenD.data._id}`;
// make sure the token has a target
const targetId = Array.from(game.user.targets)[0];
if (!targetId) {
	ui.notification.warn("This spell requires at least one valid target.");
	return;
}
const effectArray = [
    "jb2a.magic_signs.rune.evocation.intro.blue",
    "jb2a.unarmed_strike.magical.01.blue",
    "jb2a.impact.011.blue"
];


async function preloadEffects() {
    let preloaded = false;
    if (!preloaded) {
        await Sequencer.Preloader.preloadForClients(effectArray, false);
        preloaded = true;
    }
    ui.notifications.info("Effects have been preloaded!");
}

const seq = new Sequence();

if (token) {
    await preloadEffects();

    seq.effect()
        .file('jb2a.magic_signs.rune.evocation.intro.blue')
        .atLocation(token)
        .scaleToObject()
        .scale(1.6)
        .opacity(0.5)
        .waitUntilFinished();

    if (targetId) {
        seq.effect()
            .file('jb2a.unarmed_strike.magical.01.blue')
            .startTime(300)
            .endTime(1250)
            .atLocation(token)
            .stretchTo(targetId);

        seq.effect()
            .fadeIn(100)
            .delay(500)
            .file('jb2a.impact.011.blue')
            .attachTo(targetId)
            .size(targetId)
            .scale(1.5)
            .fadeOut(200);
    }
}

seq.play();