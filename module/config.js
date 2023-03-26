export const hvpunofficial = {};

hvpunofficial.weaponTypes = {
  none: "",
  light: "MIDGUARD.WeaponTypesLight",
  onehanded: "MIDGUARD.WeaponTypesOnehanded",
  throw: "MIDGUARD.WeaponTypesThrow",
  twohanded: "MIDGUARD.WeaponTypesTwohanded",
  lightthrow: "MIDGUARD.WeaponTypesLightThrow",
  onehandedthrow: "MIDGUARD.WeaponTypesOnehandedThrow",
};

async function loadHandleBarTemplates() {
  // register templates parts
  const templatePaths = [
    "systems/hvpunofficial/templates/sheets/character/character-combat.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-parameters.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-atutImplTrait.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-entropic.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-equipment.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-notes.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-navigation.hbs",
    "systems/hvpunofficial/templates/sheets/character/character-header.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-combat.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-parameters.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-atutImplTrait.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-entropic.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-equipment.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-notes.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-navigation.hbs",
    "systems/hvpunofficial/templates/sheets/npc/npc-header.hbs",
  ];
  return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
  loadHandleBarTemplates();
});
