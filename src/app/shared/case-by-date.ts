import { Case } from "./case";

export class CaseByDate {
    cases: Array<Case>;
    date: Date;
    visible: boolean;
    confirmed: number;
    deaths: number;
    recovered: number;
}

