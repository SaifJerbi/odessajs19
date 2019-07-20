import { Observer, BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class PluginsStore implements Observer<Plugin> {
  private shareWithBehavior = new BehaviorSubject<Plugin>(undefined);
  private last;

  select(): Observable<Plugin> {
    return this.shareWithBehavior.asObservable();
  }

  next(value: Plugin) {
    this.shareWithBehavior.next(value);
  }

  error(err: any) {}
  complete() {
    // Noop
  }
}
