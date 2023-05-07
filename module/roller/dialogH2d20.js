export class DialogH2d20 extends Dialog {

    constructor(rollName, attribute, skill, fatum, complication, actor, item, modifier = 0, dialogData = {}, options = {}) {
        super(dialogData, options);
        this.rollName = rollName;
        this.attribute = attribute;
        this.skill = skill;
        this.fatum = false;
        this.complication = complication;
        this.modifier = modifier;
        this.actor = actor;
        this.item = item;
        this.options.classes = ["dice-icon"];
    }

    //override
    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', '.roll', (event) => {
            let attr = html.find('[name="attribute"]').val();
            let skill = html.find('[name="skill"]').val();
            let modifier = html.find('[name="modifier"]').val();
            let fatum = html.find('[name="fatum"]').is(":checked");

            game.hvpunofficail.HeroicRoller2D20.rollHd20({
                    rollname: this.rollName,
                    attribute: attr,
                    skill_level: skill,
                    modifier: modifier,
                    fatum: fatum,
                    item: this.item,
                    actor: this.actor });
        })
    }

    static async createDialog({
        rollName = "Roll Heroic D20",
        fatum = false,
        attribute = 0,
        skill = 0,
        complication = 15,
        actor=null, item=null } = {}) {

            let dialogData = {}
            dialogData.rollName = rollName;
            dialogData.attribute = attribute;
            dialogData.fatum = fatum
            dialogData.skill = skill;
            dialogData.complication = complication;
            dialogData.actor = actor;
            dialogData.item = item;
            const html = await renderTemplate("systems/hvpunofficial/templates/dialogs/dialogH2d20.hbs", dialogData);

            let d = new DialogH2d20(rollName, attribute, skill, fatum, complication, actor, item, {
                title: rollName,
                content: html,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "ROLL"
                    }
                }
            });
            d.render(true);
        }

}