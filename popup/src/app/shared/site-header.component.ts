import { Component, OnInit } from '@angular/core';
import { HitlistService } from './services/hitlist.service';
import { AppService } from './services/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit {
  constructor(public appService: AppService, public hitlistService: HitlistService, private router: Router) {
  }

  ngOnInit() {

  }

  addToHitlist = () => {
    this.hitlistService.hitEmUp();
    this.router.navigate(['/upsert-to-hitlist']);
  }
}
