import { Component } from '@angular/core';
import { AppService } from './shared/services/app.service';
import { MessageCenterService } from './shared/services/message-center.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nerdfather-web';

  constructor(private appService: AppService, private messageCenterService: MessageCenterService)
  {
  }
}
