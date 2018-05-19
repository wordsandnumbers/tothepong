import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {GamePage} from '../pages/game/game';
import {ListPage} from '../pages/list/list';
import {LoginPage} from "../pages/login/login";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from "angularfire2/auth";

import { MomentModule } from 'angular2-moment';
import {BLE} from "@ionic-native/ble";
import {BleControllerService} from "../services/ble-controller.service";
import {HidUserService} from "../services/hid-user.service";

@NgModule({
	declarations: [
		MyApp,
		GamePage,
		ListPage,
		LoginPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(firebaseConfig, 'to-the-pong'),
		AngularFireDatabaseModule,
		MomentModule,
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		GamePage,
		ListPage,
		LoginPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AngularFireAuth,
		BLE,
		BleControllerService,
		HidUserService,
	]
})
export class AppModule {
}
