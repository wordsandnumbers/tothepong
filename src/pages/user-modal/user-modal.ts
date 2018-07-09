import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {HidUserService} from "../../services/hid-user.service";
import {User} from "../../types/user";
import {FormControl, FormGroup} from "@angular/forms";

export enum UserModalMode {
	CREATE,
	UPDATE
}

@Component({
	selector: 'page-user-modal',
	templateUrl: 'user-modal.html',
})
export class UserModalPage {
	user: User;
	userForm: FormGroup = new FormGroup({
		displayName: new FormControl()
	});
	mode: UserModalMode;
	UserModalMode = UserModalMode;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private userService: HidUserService,
	) {
		this.user = navParams.data.user || new User();
		this.mode = this.navParams.data.mode || UserModalMode.CREATE;
		this.userForm.patchValue(this.user);
	}

	public dismiss() {
		this.viewCtrl.dismiss();
	}

	public save() {
		let updatedUser = Object.assign(this.user, this.userForm.value);
		if (this.mode === UserModalMode.CREATE) {
			this.userService.addUser(updatedUser).then((user: User) => {
				this.dismiss();
			});
		} else {
			this.userService.updateUser(updatedUser).then(() => {
				this.dismiss();
			});
		}
	}
}
