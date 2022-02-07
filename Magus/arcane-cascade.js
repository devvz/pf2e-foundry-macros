// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- Rage -${tokenD.data._id}`;

// cascade end sequence
async function endSequence() {
    await Sequencer.EffectManager.endEffects({name: effectName})
}

let effectArray = [
    "jb2a.magic_signs.circle.02.enchantment.intro.blue",
    "jb2a.energy_field.02.below.blue"
];

// cascade start sequence
async function startSequence() {
    await Sequencer.Preloader.preloadForClients(effectArray, false);
    new Sequence()
        .effect()
            // initial
            .file("jb2a.magic_signs.circle.02.enchantment.intro.blue")
            .attachTo(tokenD)
            .scale(0.3)
            .fadeIn(500)
            .fadeOut(500)
            .belowTokens()
            .waitUntilFinished(-900)
            .name(effectName)
        .effect()
            // loop
            .file("jb2a.energy_field.02.below.blue")
            .attachTo(tokenD)
            .belowTokens()
            .scale(0.4)
            .persist()
            .fadeIn(500)
            .fadeOut(500)
            .name(effectName)
        .play()
}

const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? []);
if (!actors.length && game.user.character) {
    actors.push(game.user.character);
}
const ITEM_UUID = 'Compendium.pf2e.feature-effects.fsjO5oTKttsbpaKl'; // Effect: Arcane Cascade
const source = (await fromUuid(ITEM_UUID)).toObject();
source.flags.core ??= {};
source.flags.core.sourceId = ITEM_UUID;
for await (const actor of actors) {
    const existing = actor.itemTypes.effect.find((effect) => effect.getFlag('core', 'sourceId') === ITEM_UUID);
    if (existing) {
        ui.notifications.info("Left Arcane Cascade stance!")
        await existing.delete();
        await endSequence();
    } else {
        ui.notifications.info("Entered Arcane Cascade stance!")
        await actor.createEmbeddedDocuments('Item', [source]);
        await startSequence();
    }
}