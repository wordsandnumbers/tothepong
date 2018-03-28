import {Injectable} from '@angular/core';
import {BLE} from "@ionic-native/ble";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {ControllerEvent, ControllerEventType, ControllerEventValue} from "../types/controller-event";
import {Message} from "../types/message";

@Injectable()
export class BleControllerService {

	private _connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public connected: Observable<boolean> = this._connected.asObservable();

	private _controllerEvents: BehaviorSubject<ControllerEvent> = new BehaviorSubject<ControllerEvent>(undefined);
	public controllerEvents: Observable<ControllerEvent> = this._controllerEvents.asObservable();

	private _messages: BehaviorSubject<Message> = new BehaviorSubject<Message>(undefined);
	public messages: Observable<Message> = this._messages.asObservable();

	private device: any;

	constructor(
		private ble: BLE,
	) {
		this.connect();
	}

	private connect() {
		// Scan for device, if found connect to UART service
		this.ble.startScan([]).subscribe(device => {
			if (device.name === 'Adafruit Bluefruit LE') {
				this.device = device;
				this.ble.connect(device.id).subscribe(peripheral => {
					this._connected.next(true);
					this.ble.startNotification(peripheral.id, "6E400001-B5A3-F393-E0A9-E50E24DCCA9E", "6E400003-B5A3-F393-E0A9-E50E24DCCA9E").subscribe(
						(data: ArrayBuffer) => {
							let dataString: string = String.fromCharCode.apply(null, new Uint8Array(data));
							let arr: string[] = dataString.split(':');
							let value: ControllerEventValue = arr[0] === 'HID' ? arr[2] : ControllerEventValue[arr[1]];
							var event = new ControllerEvent(ControllerEventType[arr[0]], value);
							this._controllerEvents.next(Object.assign({}, event));
						},
						() => {
							this._messages.next(new Message("There was a problem talking to the controller.", "Bluetooth Trubs"));
						}
					);
				}, () => {
					this._connected.next(false);
					this._messages.next(new Message("Disconnected from controller.", "Bluetooth Trubs"));
				});
			}
		});

		setTimeout(() => {
			this.ble.stopScan().then(
				() => {
					if (!this.device) {
						this._messages.next(new Message("Couldn't find the controller. Is it close enough and turned on?", "Bluetooth Trubs"));
						this._controllerEvents.next(Object.assign({}, new ControllerEvent(ControllerEventType.HID, '12345')));
					}
				},
				() => {
				});
		}, 2000);
	}

	public reconnect() {
		if (!this._connected.getValue()) {
			this.connect();
		}
	}

}
