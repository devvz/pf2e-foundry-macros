// error reporting
if (!canvas.sequencerEffectsBelowTokens & !canvas.sequencerEffectsAboveTokens) ui.notifications.error("This macro depends on the Sequencer module. Make sure it is installed and enabled");
// set variables
let tokenD = canvas.tokens.controlled[0];
// rage end sequence
function endSequence() {
    Sequencer.EffectManager.endEffects({ name: `Rage-${tokenD.id}`, object: tokenD });
    
    new Sequence()
        .effect()
            .text("Lorakk happy now :)", {
                "fill": [
                    "#FFFF00"
                ],
                "linejoin": "round",
                "fontSize": 32,
                "strokeThickness": 5
            })
            .file("jb2a.shield.02.outro_explode.yellow")
            .attachTo(tokenD)
            .JB2A()
            .scale(0.8)
        .play()
}
// rage start sequence
function startSequence() {
    new Sequence()
        .effect()
            // trigger rage effect and text
            .atLocation(token)
            .text("LORAKK ANGRY", {
                "fill": [
                    "#1f0",
                    "red"
                ],
                "linejoin": "round",
                "fontSize": 30,
                "fontWeight": "bolder",
                "dropShadow": true,
                "dropShadowAlpha": 0.7,
                "dropShadowBlur": 10,
                "dropShadowDistance": 0,
                "strokeThickness": 5
            })
        .effect()
            // initial explosion
            .file("jb2a.misty_step.02.orange")
            .attachTo(tokenD)
            .JB2A()
            .scale(0.8)
            .fadeOut(500)
            .waitUntilFinished(-3500)
        .effect()
            // ground cracks
            .file("jb2a.ground_cracks.orange.03")
            .attachTo(tokenD)
            .JB2A()
            .fadeOut(500)
            .belowTokens()
            .waitUntilFinished(-2000)
        .effect()
            // after initial explosion
            .file("jb2a.shield.02.intro.yellow")
            .attachTo(tokenD)
            .JB2A()
            .scale(0.8)
            // .waitUntilFinished(-500)
        .effect()
            // after initial explosion
            .file("jb2a.flames.01.orange")
            .attachTo(tokenD)
            .JB2A()
            .scale(2.7)
            .opacity(0.5)
            .fadeOut(300)
            .extraEndDuration(800)
            //.waitUntilFinished(-500)        
        .effect()
            // shield loop
            .file("jb2a.shield.02.loop.yellow")
            .attachTo(tokenD)
            .JB2A()
            .scale(0.8)
            .persist()
            .name(`Rage-${tokenD.id}`)
            .fadeIn(300)
            .fadeOut(300)
            .extraEndDuration(800)
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
for await (const actor of actors) {
    const existing = actor.itemTypes.effect.find((effect) => effect.getFlag('core', 'sourceId') === ITEM_UUID);
    if (existing) {
        ui.notifications.info("Rage is deactivated!");
        await existing.delete();
        await endSequence();
    } else {
        ui.notifications.info("Rage is activated!");
        await actor.createEmbeddedDocuments('Item', [source]);
        await startSequence();
    }
}