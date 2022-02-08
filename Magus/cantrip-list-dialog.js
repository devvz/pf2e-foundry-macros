//
//provided by siliconsaint for honeybadger's warpgate v1.3 
//https://github.com/trioderegion/warpgate
//

const level = args[0].spellLevel;
const actorD = game.actors.get(args[0].actor._id);

let moreMinions = Math.floor((level-2)/2);

let choices = await warpgate.dialog([
    {
        type:'info',
        label:'<b>Cantrip List</b>'
    },
    {
        type:'header', 
        label:`The following cantrips are available for you to use:`
        
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
    
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/SteamMephit.png" width="50" height="50" style="border:0px">Steam Mephit`, 
        options: ['0','1', '2', '3','4','5','6','7','8']
    },
    {
        type:'header', 
        label:`CR 1/2 (Total:${moreMinions*4})`
        
    },
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/DustMephit.png" width="50" height="50" style="border:0px">Dust Mephit`, 
        options: ['0','1', '2', '3','4']
    },
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/IceMephit.png" width="50" height="50" style="border:0px">Ice Mephit`, 
        options: ['0','1', '2', '3','4']
    },
    
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/MagmaMephit.png" width="50" height="50" style="border:0px">Magma Mephit`, 
        options: ['0','1', '2', '3','4']
    },
    
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/Magmin.png" width="50" height="50" style="border:0px">Magmin`, 
        options: ['0','1', '2', '3','4']
    },
    
    {
        type:'header', 
        label:`CR 1 (Total:${moreMinions*2})`
        
    },
    {
        type: 'select', 
        label: `<img align=middle src="assets/tokens/summons/fire-snake-token.webp" width="50" height="50" style="border:0px">Fire Snake`, 
        options: ['0','1', '2']
    },
    {
        type:'header', 
        label:`CR 2 (Total:${moreMinions*1})`
        
    },
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/Azer.png" width="50" height="50" style="border:0px">Azer`, 
        options: ['0','1']
    },
    {
        type: 'select', 
        label: `<img align=middle src="systems/dnd5e/tokens/elemental/Gargoyle.png" width="50" height="50" style="border:0px">Gargoyle`, 
        options: ['0','1']
    },
    
    ],
    "Cantrip List",
    "Cast!")

var cantripList = {};
cantripList["Mud Mephit"] = choices[2];
cantripList["Smoke Mephit"] = choices[3];
cantripList["Steam Mephit"] = choices[4];
cantripList["Dust Mephit"] = choices[6];
cantripList["Ice Mephit"] = choices[7];
cantripList["Magma Mephit"] = choices[8];
cantripList["Magmin"] = choices[9];
cantripList["Fire Snake"] = choices[11];
cantripList["Azer"] = choices[13];
cantripList["Gargoyle"] = choices[14];

function greetings(token){
    
    const actions = ['appears','splats','flatulates','sneezes','coughs','snorts','whistles','laughs','giggles','points','dances','hums','sings','waves','burps','grunts','naps']
    
    ChatMessage.create({ content: `<img src="${token.data.img}" width="30" height="30" style="border:0px">${token.name} ${actions[Math.floor(Math.random()*actions.length)]}.` });
    
}


async function myEffectFunction(template) {

    
//prep summoning area
new Sequence()
    .sound()
        .file("/assets/sounds/firewoosh.ogg")
    .effect()
        .file('modules/jb2a_patreon/Library/2nd_Level/Misty_Step/MistyStep_01_Regular_Orange_400x400.webm')
        .atLocation(template)
        .center()
        .JB2A()
        .scale(.7)
        //.belowTokens()
    .play()
}

async function postEffects(template, token) {
//bring in our minion
new Sequence()
    .animation()
        .on(token)
            .fadeIn(500)

    .play()
}

const callbacks = {
    pre: async (template,update) => {
        myEffectFunction(template);
        await warpgate.wait(500);
    },
    post: async (template, token) => {
    postEffects(template,token);
    await warpgate.wait(500);
    greetings(token);
    }
};

const options = {controllingActor: actor};

//summon token
for (var cantripType in cantripList){
    
    if (cantripList[cantripType] > 0){
        
        for (let i = 0; i < cantripList[cantripType]; i++) {
            
            let updates = {
                token : {
                   "alpha":0,
                   "name":`${cantripType} of ${actorD.name}`,
                },
                actor: {
                   "name":`${cantripType} of ${actorD.name}`,
                }
            }

            await warpgate.spawn(cantripType, updates, callbacks, options);

            }
    }
}