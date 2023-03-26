export default class midguardrpgItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 500,
      height: 450,
      classes: ["hvpunofficial", "sheet", "item"],
    });
  }
  get template() {
    return `systems/hvpunofficial/templates/sheets/${this.item.data.type}-sheet.html`;
  }
  getData() {
    const data = super.getData();

    data.config = CONFIG.hvpunofficial;

    return data;
  }
}
