/* forked from github.com/ipaq3870/gsext-transparent-notification and modified by eleweth on 2023-07-27,
restoring compatibility with the current GNOME Shell version and introducing additional functionality */

const Lang = imports.lang;
const Main = imports.ui.main;
const MessageTray = imports.ui.messageTray;
const Gio = imports.gi;

let orig;
let banner;

let settings = imports.misc.extensionUtils.getSettings("org.gnome.shell.extensions.transparent-notifications");
let x = settings.get_int('opacity-level');
let y = settings.get_boolean('use-custom-value');

function style() {
	banner = this.source.createBanner(this);

	function defaultBehavior() {
		if (x == '0') {banner.add_style_class_name('zeroPercent');}
		else if (x == '25') {banner.add_style_class_name('twentyFivePercent');}
		else if (x == '50') {banner.add_style_class_name('fiftyPercent');}
		else {banner.add_style_class_name('seventyFivePercent');}
	}

	function customBehavior() {
		banner.add_style_class_name('customStyle');
	}

	if (y == false) {defaultBehavior();}
	else {customBehavior();}

	return banner;
}

function init() {}

function enable() {
	orig = MessageTray.Notification.prototype.createBanner;
	MessageTray.Notification.prototype.createBanner = style;
}

function disable() {
	MessageTray.Notification.prototype.createBanner = orig;
}
