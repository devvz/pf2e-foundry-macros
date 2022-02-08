// horizon thunder sphere

// set variables
let tokenD = canvas.tokens.controlled[0];
const effectName = `${tokenD.data.name}- LightningBolt -${tokenD.data._id}`;
// make sure the token has a target
const targetId = Array.from(game.user.targets)[0];
if (!targetId) {
	ui.notification.warn("This spell requires at least one valid target.");
	return;
}

// ranged spell attack roll against target's AC
// on a success deal 3d6 electricity damage
// on a crit, target takes double damage and is dazzled for 1 round

// 2 actions (somatic, verbal) = range is 30 feet
// 3 actions (somatic, verbal, material) = range is 60 feet, deals half damage on a failure

// Two Rounds If you spend 3 actions Casting the Spell, you can avoid finishing the spell and spend another 3 actions on your next turn
// to empower the spell even further. If you do, after attacking the target, whether you hit or miss, the ball of lightning explodes, 
// dealing 2d6 electricity damage to all other creatures in a 10‑foot emanation around the target (basic Reflex save). 
// Additionally, you spark with electricity for 1 minute, dealing 1 electricity damage to creatures that Grab you or that hit you 
// with an unarmed Strike or a non-reach melee weapon. 


// display dialog asking user how many actions to spend (2 or 3)
// include check-box if they want to avoid finishing the spell and spend another 3 actions on their next turn
let choices = await warpgate.dialog([
    {
        type:'info',
        label:'<b>Horizon Thunder Sphere</b>'
    },
    {
        type:'header', 
        label:'You gather magical energy into your palm, forming a concentrated ball of electricity that crackles and rumbles like impossibly distant thunder. \
		Make a ranged spell attack roll against your target\'s AC. On a success, you deal 3d6 electricity damage. On a critical success, \
		the target takes double damage and is dazzled for 1 round. The number of actions you spend when Casting this Spell determines the range and other parameters.'
        
    },
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/MudMephit.png" width="50" height="50" style="border:0px">Ghost Sound`, 
        options: ['0','1', '2', '3','4','5','6','7','8']
    },
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/SmokeMephit.png" width="50" height="50" style="border:0px">Smoke Mephit`, 
        options: ['0','1', '2', '3','4','5','6','7','8']
    },
    
    ],
    "Horizon Thunder Sphere",
    "Cast!")

// start animation at token
// ball of lightning rotates in
// depending on checkbox, ball of lightning will either make a small explosion or circle around the target until the next round

// need to work in either a timer or way to check the user's next turn

// dialog box showing two buttons: one to continue with damage and one to end the spell
