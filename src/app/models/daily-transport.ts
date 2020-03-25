import { Daily } from './daily';

export class DailyTransport {
    series: Array<Daily>;
    confirmed: number;
    deaths: number;
    recovered: number;
    confirmedAdd: number;
    deathsAdd: number;
    recoveredAdd: number;
    date:Date;
}
