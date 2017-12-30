import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {GamePage} from '../pages/game/game';
import {ListPage} from '../pages/list/list';
import {LoginPage} from "../pages/login/login";

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
	templateUrl: 'app.html'
})
export class MyApp implements AfterViewInit {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = GamePage;

	pages: Array<{title: string, component: any}>;

	firstRun: Boolean = true;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public afAuth: AngularFireAuth) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{title: 'Game', component: GamePage},
			{title: 'List', component: ListPage}
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	ngAfterViewInit() {
			if (!this.afAuth.auth) {
				// User is authenticated.
				this.setRootPage('HomePage');
			} else {
				// User is not authenticated.
				this.setRootPage(LoginPage);
			}
	}

	setRootPage(page) {

		if (this.firstRun) {

			// if its the first run we also have to hide the splash screen
			this.nav.setRoot(page)
				.then(() => this.platform.ready())
				.then(() => {

					// Okay, so the platform is ready and our plugins are available.
					// Here you can do any higher level native things you might need.
					this.statusBar.styleDefault();
					this.splashScreen.hide();
					this.firstRun = false;
				});
		} else {
			this.nav.setRoot(page);
		}
	}


	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}
