import { delimeterMsg, logF, logToHTML } from "./utils";

function lala() {
  logToHTML('' +
    `Some of the fears of being a team lead are:
    - Failure to meet end goals
    - Conflicts and fighting in team
    - Being replaced by another leader
    - Not being respected for merits
    - Being overriden by someone aggressive in a team
    `);
}

export default function gettingStartedWithSystemDesign() {
  delimeterMsg('GETTING STARTED WITH SYSTEM DESIGN');
  logF(lala);
}