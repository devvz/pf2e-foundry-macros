// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- Rage -${tokenD.data._id}`;
const effectColor = "orange"; //Change "blue" to "dark_red" for example if you have the patreon version of JB2A

const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? []);
if (!actors.length && game.user.character) {
    actors.push(game.user.character);
}

const ITEM_UUID = 'Compendium.pf2e.feature-effects.z3uyCMBddrPK5umr'; // Effect: Rage
const source = (await fromUuid(ITEM_UUID)).toObject();
source.flags.core ??= {};
source.flags.core.sourceId = ITEM_UUID;
const existing = actor.itemTypes.effect.find((effect) => effect.getFlag('core', 'sourceId') === ITEM_UUID);

let effectArray = [
    "jb2a.misty_step.02.orange",
    "jb2a.shield_themed.above.fire.01.orange",
    "jb2a.ground_cracks.orange.03",
    "jb2a.shield_themed.below.fire.03.orange"
];

async function animationStart(){
    await Sequencer.Preloader.preloadForClients("test/angry-icon-12.png", false)
    await Sequencer.Preloader.preloadForClients(effectArray, false)
    
    new Sequence()
            .effect() // rage symbol effect
                .attachTo(tokenD)
                .file(`test/angry-icon-12.png`)
                .scale(0.15)
                .scaleIn(0, 500, {ease: "easeOutCubic", delay: 100})
                .scaleOut(0, 250, {ease: "easeInCubic"})
                .offset({ y:75 }, { local: true })
                .duration(1500)
                .waitUntilFinished(-1000)
                .name(effectName)
            .effect() // initial explosion
                .attachTo(tokenD)
                .file(`jb2a.misty_step.02.${effectColor}`)
                .scale(0.6)
                .waitUntilFinished(-3500)
                .name(effectName)
            .effect() // ground cracks
                .attachTo(tokenD)
                .file(`jb2a.ground_cracks.${effectColor}.03`)
                .belowTokens()
                .scale(0.3)
                .fadeOut(500)
                .name(effectName)
            .effect() // fire after initial explosion
                .attachTo(tokenD)
                .file(`jb2a.shield_themed.above.fire.01.${effectColor}`)
                .scale(0.4)
                .fadeIn(250)
                .fadeOut(2000)
                .name(effectName)
            .effect() // persistent fire under token
                .attachTo(tokenD)
                .file(`jb2a.shield_themed.below.fire.03.${effectColor}`)
                .belowTokens()
                .scale(0.35)
                .fadeIn(500)
                .persist()
                .fadeOut(500)
                .name(effectName)
            .play()
            
    await warpgate.wait(1000);
    actor.createEmbeddedDocuments('Item', [source])
};

async function animationEnd(){
    await Sequencer.EffectManager.endEffects({name: effectName})
    await existing.delete();
};

async function toggleEffect(){
    if (existing) {
        ui.notifications.info("Rage is deactivated!");
        animationEnd();
    } else {
        ui.notifications.info("Rage is activated!");
        animationStart();
    }
};

toggleEffect();