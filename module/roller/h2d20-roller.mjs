export class HeroicRoller2D20 {
    //dicesRolled = [];
    //successTreshold = 0;
    //complicationTreshold = 15;
    //successes = 0;
    //shifts = false


    static async rollHd20({ rollname = "Roll Heroic2D20", attribute = 0, skill_level = 0, modifier = 0, complication = 15,
                        fatum = false, reroll = false, shifts = false, switch_dices = false,
                        item = null, actor = null } = {}) {

        let rollFromula = fatum ? '1d10' : '1d20';
        let heroicRoll = new Roll(rollFromula);
        let helpRoll = new Roll(rollFromula);
        //let successTreshold = parseInt(attribute) + parseInt(modifier);
        let complicationTreshold = parseInt(complication);

        await heroicRoll.evaluate({ async: true });
        await helpRoll.evaluate({ async: true });

        await HeroicRoller2D20.parseHd20Roll({
            rollname: rollname,
            heroicRoll: heroicRoll,
            helpRoll: helpRoll,
            complicationTreshold: complicationTreshold,
            modifier: modifier,
            attribute: attribute,
            skill_level: skill_level,
            reroll: reroll,
            shifts: shifts,
            switch_dices: switch_dices,
            item: item,
            actor: actor
        });
    }

    static async parseHd20Roll({rollname = "Roll Heroic2D20",
                    heroicRoll = null, helpRoll = null,
                    attribute = 0, skill_level = 0, modifier = 0,
                    complicationTreshold = 15,
                    reroll = false, shifts = false, switch_dices = false,
                    item = null, actor = null } = {}) {


        let success = false;
        let roll_result = 0;
        let successTreshold = 0;

        if (heroicRoll.result === 1) {
            success = false;
            critical = true;
            successTreshold = 1;
        }
        else if (heroicRoll.result === 20) {
            success = true;
            critical = true;
        }
        else {
            roll_result = heroicRoll.result;
            if (switch_dices) {
                roll_result = helpRoll.result;
            }

            if(heroicRoll.result == helpRoll.result){
                roll_result += skill_level
            }

            if (shifts) {
                roll_result = heroicRoll.result + actor.secondaryParameters.shifts.value
                roll_result = Math.min(roll_result, 20)
                roll_result = Math.max(roll_result, 1)
                actor.secondaryParameters.shifts.value--;
            }

            successTreshold = roll_result + attribute + skill_level + modifier;
            if (successTreshold >= complicationTreshold) {
                success = true;
            }
        };

        await HeroicRoller2D20.sendToChat({
            rollname: rollname,
            heroicRollResult: heroicRoll.result,
            helpRollResult: helpRoll.result,
            successTreshold: successTreshold,
            complicationTreshold: complicationTreshold,
            success: success,
            reroll: reroll,
            shifts: shifts,
            switch_dices: switch_dices,
            item: item,
            actor: actor
        });
    }

    static async switchRollH2D20({rollname = "Roll Heroic2D20",
                    heroicRoll = null, helpRoll = null,
                    attribute = 0, skill_level = 0, modifier = 0,
                    complicationTreshold = 15,
                    reroll = false, shifts = false, switch_dices = true,
                    item = null, actor = null } = {} ) {


           await HeroicRoller2D20.parseHd20Roll({
            rollname: '${rollname} switched',
            heroicRoll: heroicRoll,
            helpRoll: helpRoll,
            complicationTreshold: complicationTreshold,
            modifier: modifier,
            attribute: attribute,
            skill_level: skill_level,
            reroll: reroll,
            shifts: shifts,
            switch_dices: switch_dices,
            item: item,
            actor: actor
        });
    }

    static async shiftRollH2d20({rollname = "Roll Heroic2D20",
                    heroicRoll = null, helpRoll = null,
                    attribute = 0, skill_level = 0, modifier = 0,
                    complicationTreshold = 15,
                    reroll = false, shifts = true, switch_dices = false,
                    item = null, actor = null } = {}) {


           await HeroicRoller2D20.parseHd20Roll({
            rollname: '${rollname} shifted',
            heroicRoll: heroicRoll,
            helpRoll: helpRoll,
            complicationTreshold: complicationTreshold,
            modifier: modifier,
            attribute: attribute,
            skill_level: skill_level,
            reroll: reroll,
            shifts: shifts,
            switch_dices: switch_dices,
            item: item,
            actor: actor
        });
    }



    //static async rerollD20
    static async rerollHd20({ rollname = "Roll Heroic2D20", attribute = 0, skill_level = 0, modifier = 0, complication = 15,
                        fatum = false, reroll = false, shifts = false, switch_dices = false,
                        item = null, actor = null } = {}) {

        await HeroicRoller2D20.rollHd20({ rollname: `${rollname} re-roll`,
                                          attribute: attribute,
                                          modifier: modifier,
                                          skill_level: skill_level,
                                          complication: complication,
                                          fatum: fatum,
                                          reroll: true,
                                          shifts: shifts,
                                          switch_dices: switch_dices,
                                          item: item,
                                          actor: actor });
    }

    //static async sendToChat
    static async sendToChat({ rollname = "Roll Heroic2D20", heroicRoll = null, helpRoll = null,
                    successTreshold = 0, complicationThreshold = 15, success = false,
                    attribute = 0, skill_level = 0, modifier = 0,
                    reroll = false, shifts = false, switch_dices = false,
                    item = null, actor = null } = {}) {

        //let successesNum = Roller2D20.getNumOfSuccesses(dicesRolled);
        //let complicationThresholdNum = Roller2D20.getNumOfComplications(dicesRolled);
        let rollData = {
            rollname: rollname,
            complicationThreshold: complicationThreshold,
            successTreshold: successTreshold,
            heroicRoll: heroicRoll.result,
            helpRoll: helpRoll.result,
            successes: (successTreshold - complicationThreshold),
            reroll: reroll,
            shifts: shifts,
            switch_dices: switch_dices,

        }
        const html = await renderTemplate("systems/hvpunofficial/templates/chat/rollH2d20.hbs", rollData);

        let hvpunofficialRoll = {}

        hvpunofficialRoll.rollname = rollname;
        //hvpunofficialRoll.dicesRolled = dicesRolled;
        hvpunofficialRoll.heroicRoll = heroicRoll;
        hvpunofficialRoll.helpRoll = helpRoll;
        hvpunofficialRoll.shifts = shifts;
        hvpunofficialRoll.switch_dices = switch_dices;
        hvpunofficialRoll.modifier = modifier;
        hvpunofficialRoll.attribute = attribute;
        hvpunofficialRoll.skill_level = skill_level;
        hvpunofficialRoll.successTreshold = successTreshold;
        hvpunofficialRoll.complicationTreshold = complicationTreshold;
        hvpunofficialRoll.diceFace = "d20";
        hvpunofficialRoll.item = item;
        hvpunofficialRoll.actor = actor;

        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({
                actor: actor,
              }),
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            flags: { hvpunofficialroll: hvpunofficialRoll },
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,

        };

        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        await ChatMessage.create(chatData);
    }
    //static getNumOfSuccesses(results)

    //static getNumOfComplications(results)

    //static async parseD6Roll

        //run await Roller2D20.sendD6ToChat

    //static async rerollD6

    //static async addD6

    //static async sendD6ToChat

}