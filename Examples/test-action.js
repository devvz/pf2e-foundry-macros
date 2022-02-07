// You can quickly find the correct values for ‘weapon’, ‘actionIndex’, and ‘caster’ if you drag the weapon you’re using onto your macro toolbar and open up the macro.
// For this example, it looks like this:
// game.pf2e.rollActionMacro(“GBayHHsYQJWcT6MQ”, 0, “Dagger”)
let caster = 'k5nBheS4gcPsL4Xr'; // EDIT THIS - ID of actor
let actionIndex = 50; // EDIT THIS - Index of action on character page
let weapon = 'Retribution Axe'; // EDIT THIS - Name of weapon

let file = "modules/jb2a_patreon/Library/Generic/Weapon_Attacks/Melee/"; // EDIT THIS - Base directory of your animation files, this is for the Patreon version of JB2A
let hitFile = "Dagger02_01_Regular_White_800x600.webm"; // EDIT THIS - Name of animation for a regular hit
let critFile = "Dagger02_Fire_Regular_Orange_800x600.webm"; // EDIT THIS - Name of animation for a crit

if (game.user.targets.size != 1) ui.notifications.error('Please target one token only');
if (canvas.tokens.controlled.length == 0) ui.notifications.error("Please select your token");
if (!canvas.sequencerEffectsBelowTokens & !canvas.sequencerEffectsAboveTokens) ui.notifications.error("This macro depends on the Sequencer module. Make sure it is installed and enabled");
let messageCount = 0; // Don’t edit, resets the message counter when macro is called
const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

game.pf2e.rollActionMacro(caster, actionIndex, weapon) // If NOT using PF2e, replace this with whatever function needs to be called when doing a weapon strike

// Use Sequencer to handle animation
async function strikeAnim(hit) {
   await wait(1000); // Adds a pause between the strike roll and the animation
   new Sequence() // Check Sequencer wiki for info about the options below
      .effect()
      .atLocation(Array.from(canvas.tokens.controlled)[0])
      .reachTowards(Array.from(game.user.targets)[0])
      .JB2A()
      .baseFolder(file)
      .missed(hit === "Miss")
      .addOverride(async (effect, data) => {
         if (hit === "Crit") {
            data.file = critFile;
         } else if (hit === "Hit" || hit === "Miss") {
            data.file = hitFile;
         }
         return data
      })
   .play();
}

// Function to play a sound effect, varies depending on crit/hit/miss
// If you don't want a sound effect, you can delete this function
async function playSFX (hit) {
   await wait(1000); // Adds a pause between the strike roll and the sound effect
   let sfxStrike = Math.floor(Math.random() * 15) + 1; // EDIT THIS - Randomises strike sound effect out of 15 possible files
   let sfxHit = Math.floor(Math.random() * 15) + 1; // EDIT THIS - Randomises hit sound effect out of 15 possible files
   let sfxMiss = Math.floor(Math.random() * 5) + 1; // EDIT THIS - Randomises miss sound effect out of 5 possible files
   AudioHelper.play({ // Plays a sound when the strike is rolled, edit the ‘src’ line below for your files
      src: [`music/SFX/Weapon/Weapon Draw Metal/Weapon Draw Metal ${sfxStrike}.wav`], // EDIT THIS
      volume: 0.8,
      autoplay: true,
      loop: false
   }, true);
   if (hit === "Hit" || hit === "Crit") {
      await wait(700); // Adds a pause between the initial sound effect and the hit/crit sound effect
      AudioHelper.play({ // Plays a sound if hit or crit, edit the ‘src’ line below for your sound file
      src: [`music/SFX/Weapon/Stab/Stab ${sfxHit}.wav`], // EDIT THIS
      volume: 0.8,
      autoplay: true,
      loop: false
      }, true);
      if (hit === "Crit") {
         AudioHelper.play({ // Plays a sound if crit, edit the ‘src’ line below for your file
            src: [`music/SFX/Weapon/Crit.wav`], // EDIT THIS
            volume: 0.8,
            autoplay: true,
            loop: false
         }, true);
      };
   }
   if (hit === "Miss") {
      await wait(700); // Adds a pause between the initial sound effect and the miss sound effect
      AudioHelper.play({ // Plays a sound if attack missed, edit the ‘src’ line below for your sound file
         src: [`music/SFX/Weapon/Whoosh/Whoosh ${sfxMiss}.wav`], // EDIT THIS
         volume: 0.8,
         autoplay: true,
         loop: false
      }, true);
   }
}

// Handles the actual playing of the animation and sound effect, depends on chat cards
// If using PF2e there’s no need to change anything below
let hookID = Hooks.on("renderChatMessage", function(chatMessage) {
   messageCount++;
   if (messageCount >= 2) { 
      Hooks.off("renderChatMessage", hookID); // Switch off the hook after 2 messages to avoid clogging the system if no strikes are rolled
   };
   if (chatMessage.data.flavor !== undefined) {
      if (chatMessage.data.flavor.includes("Strike") & chatMessage.data.flavor.includes("Result:")) {
         if (chatMessage.data.flavor.includes("Critical Hit")) {
            strikeAnim("Crit");
            playSFX("Crit"); // Remove this line if you don't want a sound
            Hooks.off("renderChatMessage", hookID);
         } else if (chatMessage.data.flavor.includes("Hit")) {
            strikeAnim("Hit");
            playSFX("Hit"); // Remove this line if you don't want a sound
            Hooks.off("renderChatMessage", hookID);
         } else if (chatMessage.data.flavor.includes("Miss")) {
            strikeAnim("Miss");
            playSFX("Miss"); // Remove this line if you don't want a sound
            Hooks.off("renderChatMessage", hookID);
         }
      }
   }
});