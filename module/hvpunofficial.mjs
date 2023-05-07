// Import document classes.
// Import document classes.
import { HvpunofficialActor } from "./documents/actor.mjs";
import { HvpunofficialItem } from "./documents/item.mjs";
// Import sheet classes.
import { HvpunofficialActorSheet } from "./sheets/actor-sheet.mjs";
import { HvpunofficialItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { BOILERPLATE } from "./helpers/config.mjs";

//Import rolling classes
//import { Roller2D20 } from './roller/h2d20-roller.mjs'
import { HeroicRoller2D20 } from './roller/h2d20-roller.mjs'
import { DialogH2d20 } from './roller/dialogH2d20.js'


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.hvpunofficial = {
    HvpunofficialActor,
    HvpunofficialItem,
    rollItemMacro,
    HeroicRoller2D20,
    DialogH2d20
  };

  // Add custom constants for configuration.
  CONFIG.BOILERPLATE = BOILERPLATE;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "2d20 + @mainParameters.dexterity.value + @skills.reflex.value",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = HvpunofficialActor;
  CONFIG.Item.documentClass = HvpunofficialItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hvpunofficial", HvpunofficialActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hvpunofficial", HvpunofficialItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

Hooks.on('renderChatMessage', (message, html, data) => {
  let rrlBtn = html.find('.reroll-button')
  if (rrlBtn.length > 0) {
    rrlBtn[0].setAttribute('data-messageId', message.id)
    rrlBtn.click((el) => {

        let hvpunofficialRoll = message.flags.hvpunofficialroll;

        if (hvpunofficialRoll.diceFace == 'd20') {
            HeroicRoller2D20.rerollHd20({
                rollname: hvpunofficialRoll.rollname,
                attribute: hvpunofficialRoll.attribute,
                skill_level: hvpunofficialRoll.skill_level,
                modifier: hvpunofficialRoll.modifier,
                complication: hvpunofficialRoll.complication,
                fatum: hvpunofficialRoll.fatum,
                reroll: true,
                shifts: hvpunofficialRoll.shifts,
                switch_dices: hvpunofficialRoll.switch_dices,
                item: hvpunofficialRoll.item,
                actor: hvpunofficialRoll.actor});


        } else if (hvpunofficialRoll.diceFace == 'd6') {
          HeroicRoller2D20.rerollD6({
            rollname: hvpunofficialRoll.rollname,
            rerollIndexes: rerollIndex,
            dicesRolled: hvpunofficialRoll.dicesRolled,
            weapon: message.flags.weapon});
        } else {
          ui.notifications.notify('No dice face reckognized')
        }
      }
    )
  }

  let switchBtn = html.find('.switch-button');
  if (switchBtn.length > 0) {
    switchBtn[0].setAttribute('data-messageId', message.id);
    switchBtn.click((el) => {

        let hvpunofficialRoll = message.flags.hvpunofficialroll


            HeroicRollerH2D20.switchRollH2D20({
                rollname: hvpunofficialRoll.rollname,
                attribute: hvpunofficialRoll.attribute,
                skill_level: hvpunofficialRoll.skill_level,
                modifier: hvpunofficialRoll.modifier,
                complication: hvpunofficialRoll.complication,
                fatum: hvpunofficialRoll.fatum,
                reroll: hvpunofficialRoll.reroll,
                shifts: hvpunofficialRoll.shifts,
                switch_dices: true,
                item: hvpunofficialRoll.item,
                actor: hvpunofficialRoll.actor});
    })
  }

  let shiftBtn = html.find('.shift-button');
  if (shiftBtn.length > 0) {
    shiftBtn[0].setAttribute('data-messageId', message.id);
    shiftBtn.click((el) => {

        let hvpunofficialRoll = message.flags.hvpunofficialroll
        HeroicRollerH2D20.shiftRollH2D20({
                rollname: hvpunofficialRoll.rollname,
                attribute: hvpunofficialRoll.attribute,
                skill_level: hvpunofficialRoll.skill_level,
                modifier: hvpunofficialRoll.modifier,
                complication: hvpunofficialRoll.complication,
                fatum: hvpunofficialRoll.fatum,
                reroll: hvpunofficialRoll.reroll,
                shifts: true,
                switch_dices: hvpunofficialRoll.switch_dices,
                item: hvpunofficialRoll.item,
                actor: hvpunofficialRoll.actor});
    })
  }


  let addBtn = html.find('.add-button')
  if (addBtn.length > 0) {
    addBtn[0].setAttribute('data-messageId', message.id)
    addBtn.click((ev) => {
      let hvpunofficialRoll = message.flags.hvpunofficialroll
      let weapon = message.flags.weapon
      let actor = message.flags.actor
      game.hvpunofficial.DialogD6.createDialog({
        rollname: hvpunofficialRoll.rollname,
        diceNum: 1,
        hvpunofficialRoll: hvpunofficialRoll,
        weapon: weapon,
        actor: actor
      })
    })
  }
})

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper("timesFivePlusTen", function (value1) {
  let sum = value1 * 5 + 10;
  return sum;
});

Handlebars.registerHelper("multiplyPlus", function (val1, val2=5, val3=0, val4=0) {
  //TODO: arguments check and adding from list of args
  let result = Number(val1) * Number(val2) + Number(val3) + Number(val4);
  return result;
});

Handlebars.registerHelper("timesFive", function (value1) {
  let sum = value1 * 5;
  return sum;
});

Handlebars.registerHelper("sum", function () {
  let sum = 0;
  for (let argument in arguments) {
    if (Number.isInteger(arguments[argument])) sum = sum + Number(arguments[argument]);
  }
  return sum;
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this)
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this)
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this)
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this)
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this)
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this)
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this)
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this)
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this)
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this)
      default:
        return options.inverse(this)
    }
  });

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.hvpunofficial.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "hvpunofficial.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then(item => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`);
    }

    // Trigger the item roll
    item.roll();
  });
}