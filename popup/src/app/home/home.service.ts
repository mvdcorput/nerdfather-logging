import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HomeService {
  private _godmodeLikes = new BehaviorSubject<number>(277);
  private _godmodeDontLikes = new BehaviorSubject<number>(0);
  private liked: boolean = false;

  readonly godmodeLikes = this._godmodeLikes.asObservable();
  readonly godmodeDontLikes = this._godmodeDontLikes.asObservable();

  constructor(private http: HttpClient) {
    this.initialize();    
  }

  initialize() {
    // this.http.get<number>(`/home/godmode-likes`).subscribe(
    //   data => {
    //     this._godmodeLikes.next(data);
    //   },
    //   error => console.log('Could not load godmode likes count.')
    // );

    // this.http.get<number>(`/home/godmode-dont-likes`).subscribe(
    //   data => {
    //     this._godmodeDontLikes.next(data);
    //   },
    //   error => console.log('Could not load godmode dont like count.')
    // );
  }


  dontLikeGodmode = async () => {
    this.http.post<number>(`/home/godmode-dont-like`, null).subscribe(
      data => {
        this._godmodeDontLikes.next(data);
      },
      error => console.error('Some error occured on the server, please try again later')
    );
  }

  downloadGodmode(fileName: string) {  
    this.http.get('/download/' + fileName, { responseType: "blob" })  
      .subscribe((result: any) => {  
        if (result.type != 'text/plain') {  
          // var blob = new Blob([result]);  
          // this.fileSaverService.save(blob, 'Nerdfathers Godmode.exe');
        }  
        else {  
          console.error('Damn, sold out for the moment');  
        }  
      });  
  }  

  likeGodmode = async () => {
    if (this.liked) {
      console.warn("You can't like Nerdfathers Godmode twice, that would corrupt the counter");
      
      return;
    }

    this.http.post<number>(`/home/godmode-like`, null).subscribe(
      data => {
        this.liked = true;
        this._godmodeLikes.next(data);
      },
      error => console.log('Could not load like Godmode.')
    );
  }
}