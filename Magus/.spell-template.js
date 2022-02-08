// spell name

// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- LightningBolt -${tokenD.data._id}`;
// make sure the token has a target
const targetId = Array.from(game.user.targets)[0];
if (!targetId) {
	ui.notification.warn("This spell requires at least one valid target.");
	return;
}