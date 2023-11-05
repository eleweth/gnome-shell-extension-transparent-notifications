/* forked from github.com/ipaq3870/gsext-transparent-notification and modified by eleweth on 2023-07-27,
restoring compatibility with the current GNOME Shell version and introducing additional functionality */

import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

let orig;

export default class TransparentNotifications extends Extension {

enable() {
	const extension = Extension.lookupByUUID('transparent-notifications@eleweth');
	let settings = extension.getSettings("org.gnome.shell.extensions.transparent-notifications");

	let x = settings.get_int('opacity-level');
	let y = settings.get_boolean('use-custom-value');

	function style() {
		let banner = this.source.createBanner(this);
		if (y == true) {banner.add_style_class_name('customStyle');}
		else {
			if (x == '0') {banner.add_style_class_name('zeroPercent');}
			else if (x == '25') {banner.add_style_class_name('twentyFivePercent');}
			else if (x == '50') {banner.add_style_class_name('fiftyPercent');}
			else {banner.add_style_class_name('seventyFivePercent');}
		}
		return banner;
	}

	orig = MessageTray.Notification.prototype.createBanner;
	MessageTray.Notification.prototype.createBanner = style;
}

disable() {
	MessageTray.Notification.prototype.createBanner = orig;
}

}