/** DnD5e Rage feature bonuses, Active Effect and animation using Warp Gate, Item Macro, Sequencer and JB2A **/
/** Modified to PF2e by Devvz, not using Item Macro **/

/**************************************************************************
MIT License Copyright (c) 2021 Jules | JB2A 
Full license text found here: https://opensource.org/licenses/MIT
****************************************************************************/
/* Thanks to @honeybadger for all the lessons and guiding me through this macro ! */

// jb2a.misty_step.02.orange
// jb2a.shield_themed.above.fire.01.orange
// jb2a.shield_themed.below.fire.01.orange
// jb2a.ground_cracks.orange.03
// jb2a.static_electricity.02.blue
  // .filter("ColorMatrix", { hue: 150 })

const tokenD = canvas.tokens.controlled[0];

const animation = async()=>{
    let effectScale = 0.25;
    let effectColor = "orange"; //Change "blue" to "dark_red" for example if you have the patreon version of JB2A
    
    new Sequence() 
        .effect()
            .attachTo(tokenD) //Instead of atLocation(), we want the animation to be stuck to the token so it follows it around
            .file(`jb2a.misty_step.02.${effectColor}`)
            .scale(effectScale)
            .waitUntilFinished(1000)
            .name(`${item.actor.data.name}- Rage -${token.data._id}`) //We want a unique name that will make dismissing it later on easier.
        .effect()
            .attachTo(tokenD)
            .file(`jb2a.ground_cracks.orange.${effectColor}.03`)
            .belowTokens() //by default, the effect would be played above the tokens, we want this one to be played underneath so we can place the overlay above it
            .scale(effectScale)
            .fadeOut(250)
            .name(`${item.actor.data.name}- Rage -${token.data._id}`)
        .effect()
            .attachTo(tokenD)
            .file(`jb2a.energy_strands.overlay.${effectColor}.01`)
            .scale(effectScale)
            .persist()
            .fadeOut(500)
            .name(`${item.actor.data.name}- Rage -${token.data._id}`) //Named it the same as the previous effect so we can dismiss both effects at the same time
        .play();
};

async function animationEnd(){
  Sequencer.EffectManager.endEffects({name: `${item.actor.data.name}- Rage -${token.data._id}`}) //When we revert the mutation, we'll call this function to dismiss the animation
}



// const ITEM_UUID = 'Compendium.pf2e.feature-effects.z3uyCMBddrPK5umr'; // Effect: Rage
// await actor.createEmbeddedDocuments('Item', [source]);

let mCallbacks = {
  post: animation //Straight after the mutation, we want to execute this animation function as a callback
};
function condition(eventData){
  console.log(token.id, eventData.actorData.token);
  console.log(token.id === eventData.actorData.token._id);    
  return token.id === eventData.actorData.token._id; //This condition makes sure we have the correct token to revert the mutation from
}
let mUpdates = {
    embedded: {
      ActiveEffect:{
        'Rage':{
        icon : item.img,
        changes: [{
          "key": "data.bonuses.mwak.damage", //add the bonus to melee weapon attacks
          "mode": 2,
          "value": (Math.ceil(Math.floor(level/(9-(Math.floor(level/9)))+2))), //Some clever math to add the correct amount, depending on the barbarian level
          "priority": 0
          },{
          "key": "data.traits.dr.value", //Add a resistance to Slashing damage
          "value": "slashing",
          "mode": 2,
          "priority": 0
          },{
          "key": "data.traits.dr.value",
          "value": "bludgeoning",
          "mode": 2,
          "priority": 0
          },{
          "key": "data.traits.dr.value",
          "value": "piercing",
          "mode": 2,
          "priority": 0
          }],
          duration : {rounds: 10} 
        }
      }
    }   
};
const mOptions = {
  comparisonKeys: {ActiveEffect: 'label'},
  name: "Rage" //Let's give the mutation a name so when we shift-click the revert button, we'll identify the right mutation to revert
};

// await item.roll(); //This asks ItemMacro to roll the item, as normal.
await warpgate.mutate(token.document, mUpdates, mCallbacks, mOptions); //Let's mutate the token document with some updates(stats changes and active effect on), callbacks(animation function) and options(name).
warpgate.event.trigger(warpgate.EVENT.REVERT, animationEnd, condition); //When we revert the changes, we want the animation to end as well so we're executing the animationEnd() function.