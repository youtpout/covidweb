import { NewsDto } from "./news-dto";

export class NewsByDateDto {
    date: Date;
    news: Array<NewsDto>;
}