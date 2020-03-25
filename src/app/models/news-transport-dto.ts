import { NewsDto } from "./news-dto";
import { NewsByDateDto } from "./news-by-date-dto";

export class NewsTransportDto {
    totalNews: number;
    newsByPage: number;
    page: number;
    newsByDate: Array<NewsByDateDto>;
}
