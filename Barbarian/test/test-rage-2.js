// error reporting
if (!canvas.sequencerEffectsBelowTokens & !canvas.sequencerEffectsAboveTokens) ui.notifications.error("This macro depends on the Sequencer module. Make sure it is installed and enabled");

//*---------------------------------------------------------*//

// jb2a.misty_step.02.orange
// jb2a.shield_themed.above.fire.01.orange
// jb2a.shield_themed.below.fire.01.orange
// jb2a.ground_cracks.orange.03
// jb2a.static_electricity.02.blue
  // .filter("ColorMatrix", { hue: 150 })

// set variables
let tokenD = canvas.tokens.controlled[0];

async function animationEnd(){
    Sequencer.EffectManager.endEffects({name: effectName})
    new Sequence()
        .effect() // happy symbol effect
            .attachTo(tokenD)
            .file(``)
            .scale(effectScale)
        .play()
}
const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? []);
if (!actors.length && game.user.character) {
    actors.push(game.user.character);
}
const ITEM_UUID = 'Compendium.pf2e.feature-effects.z3uyCMBddrPK5umr'; // Effect: Rage
const source = (await fromUuid(ITEM_UUID)).toObject();
source.flags.core ??= {};
source.flags.core.sourceId = ITEM_UUID;
const existing = actor.itemTypes.effect.find((effect) => effect.getFlag('core', 'sourceId') === ITEM_UUID);
if (existing) {
    ui.notifications.info("Rage is deactivated!");
    await existing.delete();
    await animationEnd();
} else {
    ui.notifications.info("Rage is activated!");
    await actor.createEmbeddedDocuments('Item', [source]);

    const animation = async()=>{
        let effectScale = 0.25;
        let effectColor = "orange"; //Change "blue" to "dark_red" for example if you have the patreon version of JB2A
        let effectName = `${tokenD.data.name}- Rage -${tokenD.data._id}`;
        
        new Sequence()
            .effect() // rage symbol effect - AbjurationRuneIntro_01_Regular_Yellow_400x400
                .attachTo(tokenD)
                .file(``)
                .scale(effectScale)
                .name(effectName)
            .effect() // initial explosion
                .attachTo(tokenD)
                .file(`jb2a.misty_step.02.${effectColor}`)
                .scale(effectScale)
                .waitUntilFinished(-3500)
                .name(effectName)
            .effect() // ground cracks
                .attachTo(tokenD)
                .file(`jb2a.ground_cracks.${effectColor}.03`)
                .belowTokens()
                .waitUntilFinished(-2000)
                .fadeOut(500)
                .name(effectName)
            .effect() // fire after initial explosion
                .attachTo(tokenD)
                .file(`jb2a.shield_themed.above.fire.01.${effectColor}`)
                .scale(effectScale)
                .fadeOut(500)
                .name(effectName)
            .effect() // persistent fire under token
                .attachTo(tokenD)
                .file(`jb2a.shield_themed.below.fire.01.${effectColor}`)
                .belowTokens()
                .scale(effectScale)
                .fadeIn(500)
                .persist()
                .fadeOut(500)
                .name(effectName)
            .play();
    };
}

