import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { NewsTransportDto } from '../models/news-transport-dto';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  item: NewsTransportDto;
  error: boolean = false;

  constructor(private _itemService: DataService) { }

  ngOnInit(): void {
    this.updateNews();
    setInterval(() => {
      this.updateNews();
    }, 60000);


  }

  updateNews() {
    this._itemService.getNews(50, 0).subscribe(i => {
      if (JSON.stringify(i) !== JSON.stringify(this.item)) {
        this.item = i;
      }
      this.error = false;
    }, e => {
      this.error = true;
    });
  }

}
