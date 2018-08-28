import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {GamePage} from '../pages/game/game';
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
import {UserService} from "../services/user.service";
import {UserModalPage} from "../pages/user-modal/user-modal";
import {MatchService} from "../services/match.service";
import {DebugGameModal} from "../pages/game/debug-game-modal";

@NgModule({
	declarations: [
		MyApp,
		GamePage,
		LoginPage,
		UserModalPage,
		DebugGameModal,
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
		LoginPage,
		UserModalPage,
		DebugGameModal,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AngularFireAuth,
		BLE,
		BleControllerService,
		MatchService,
		UserService,
	]
})
export class AppModule {
}
