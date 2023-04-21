/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class HvpunofficialActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.hvpunofficial || {};


    console.log('DEBUG: Preparing character')
    console.log(actorData)
    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    console.log('DEBUG: before _prepareCharacterData system');
    console.log(actorData.system);
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    //count maximums
    //convert undefined or null to 0.
    systemData.secondaryParams.potential.max = Number(systemData.mainParameters.verve.value)
                                              + Number(systemData.secondaryParameters.potential.bonus);
    systemData.secondaryParams.shifts.max = Number(systemData.mainParameters.verve.value)
                                          + Number(systemData.secondaryParameters.shifts.bonus);
    systemData.secondaryParameters.athletic.max = Number(systemData.mainParameters.bodyBuild.value)
                                                + Number(systemData.mainParameters.dexterity.value)
                                                + Number(systemData.secondaryParameters.athletic.bonus);
    systemData.secondaryParameters.appearance.max = Number(systemData.mainParameters.bodyBuild.value)
                                                    + Number(systemData.mainParameters.verve.value)
                                                    + Number(systemData.secondaryParameters.appearance.bonus);
    systemData.secondaryParameters.ether.max = 5 * Number(systemData.mainParameters.intelligence.value)
                                             + Number(systemData.secondaryParameters.ether.bonus);
    systemData.secondaryParameters.concentration.max = Number(systemData.mainParameters.verve.value)
                                                     + Number(systemData.mainParameters.cool.value)
                                                     + Number(systemData.secondaryParameters.concentration.bonus);

    systemData.secondaryParameters.vitality.max = Number(systemData.mainParameters.bodyBuild.value) * 5 + 15
                                                + Number(systemData.secondaryParameters.vitality.bonus)
    // Loop through ability scores, and add their modifiers to our sheet output.
    //for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      //ability.mod = Math.floor((ability.value - 10) / 2);
    //}
    console.log('DEBUG: before _prepareCharacterData secondaryParameters');
    console.log(actorData.system.secondaryParameters);
    for (let [key, skill] of Object.entries(systemData.skills)) {
        console.log(skill);
        let paramname = skill.mainParameter
        console.log(paramname);
        skill.modified_value = Number(skill.value) + Number(systemData.mainParameters[paramname].value);
        console.log(skill);
    }
    console.log('DEBUG: before _prepareCharacterData system');
    console.log(actorData.system);
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

}