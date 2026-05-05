import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  requestBusyCount = signal(0)
  
  busy(){
    this.requestBusyCount.update(current => 
      current + 1
    )
  }

  hiddle(){
    this.requestBusyCount.update(current => Math.min(0 , current - 1))
  }

}
