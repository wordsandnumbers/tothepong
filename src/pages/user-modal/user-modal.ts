import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {UserService} from "../../services/user.service";
import {User} from "../../types/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
	userForm: FormGroup;
	mode: UserModalMode;
	UserModalMode = UserModalMode;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private userService: UserService,
		private fb: FormBuilder,
	) {
		this.user = navParams.data.user || new User();
		this.mode = this.navParams.data.mode || UserModalMode.CREATE;
		this.userForm = this.fb.group({
			displayName: [this.user.displayName, Validators.required]
		});
	}

	public dismiss() {
		this.viewCtrl.dismiss();
	}

	public save() {
		if (this.userForm.valid) {
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
}
