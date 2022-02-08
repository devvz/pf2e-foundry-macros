// draw the lightning

// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- LightningBolt -${tokenD.data._id}`;
// make sure the token has a target
const targetId = Array.from(game.user.targets)[0];
if (!targetId) {
	ui.notification.warn("This spell requires at least one valid target.");
	return;
}

// make sure the token has a target
// check the target's height value to see if it is high enough

// if target is high enough, create storm cloud offset from the caster
// let storm cloud sit idle for a bit, then summon a lightning crack from the cloud to the caster (but also going through the target)

// electricity effect on target

// duration of 1 minute, tie in with game clock somehow?