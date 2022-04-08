/**
 * System: D&D5e
 * Chaos Bolt - automates the selection of elemental damage type based on damage roll results.
 * Rolls a new attack and 
 */

// get the actor data of the selected token
token = canvas.tokens.get(args[0].tokenId);
actor = token.actor;

// make an array of damage types
const damage_types = [
  "Acid",
  "Cold",
  "Fire",
  "Fire",
  "Lightning",
  "Poison",
  "Psychic",
  "Thunder",
];

// check if the attack hits the targeted token
// otherwise do nothing
if (args[0].hitTargets.length > 0) {
  
  // get the numbers from the rolled damage dice and save them to a map
  // with their corresponding damage types
  let rolledTypes = args[0].damageRoll.terms
    .find((t) => t?.faces === 8)
    .results.map((e) => damage_types[e.result - 1]);
  
  // remove duplicates
  let types = [...new Set(rolledTypes)];

  
  // send selectable damage types as a popup to the user
  // by calling the `choose` function
  let type;
  if (types.length !== 1) {
    type = await choose(types);
  } else {
    type = types[0];
  }

  // check if the damage dice numbers are equal
  // notify user they may cast on a new target
  let bounce = types.length !== rolledTypes.length;
  if (bounce) {
    ui.notifications.info(
      `Chaos bolt bounces! Cast it again on another target within 30ft of the current one.`
    );
  }
  
  // apply the damage of the damage roll as the selected damage type
  let damageRoll = new Roll(`${args[0].damageRoll.total}`).roll();
  await new MidiQOL.DamageOnlyWorkflow(
    actor,
    token,
    damageRoll.total,
    type,
    args[0].hitTargets.map((t) => canvas.tokens.get(t._id)),
    damageRoll,
    { itemCardId: args[0].itemCardId, useOther: false }
  );
}

// choose is a function to prompt the user to select the damage type
async function choose(options) {
  
  let value = await new Promise((resolve) => {
    
    // set the popup button labels with the passed in damage types from the options map
    let buttons = options.map((type) => {
      return {
        label: type,
        callback: () => {
          resolve(type);
        },
      };
    });
    
    // build the dialog of the popup
    new Dialog({
      title: "Select damage type",
      buttons: buttons,
    }).render(true);
  });
  return value;
}
