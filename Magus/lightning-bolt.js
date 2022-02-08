// lightning bolt

// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- LightningBolt -${tokenD.data._id}`;
// make sure the token has a target
const targetId = Array.from(game.user.targets)[0];
if (!targetId) {
	ui.notification.warn("This spell requires at least one valid target.");
	return;
}

// fire lightning bolt towards target
new Sequence()
    .effect()
        .atLocation(tokenD)
        .file("jb2a.chain_lightning.primary.blue")
        .stretchTo(targetId)
        .scale(1)
        .name(effectName)
        .waitUntilFinished(-500)
    .effect()
        .atLocation(targetId)
        .file("jb2a.impact.blue.12")
        .scale(0.5)
        .name(effectName)
    .play();



// misc. lightning effects on target?