import { Subject, Subscription } from 'rxjs';
export declare class EventListener {
    eventName: string;
    events: Subject<Event>;
    eventsSubscription: Subscription;
    teardownCallback: () => void;
}
