import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const OPACITY_LEVEL = 'opacity-level';
const USE_CUSTOM = 'use-custom-value';

export default class TransparentNotificationsPreferences extends ExtensionPreferences {
fillPreferencesWindow(window) {
	const extension = ExtensionPreferences.lookupByUUID('transparent-notifications@eleweth');
	let settings = extension.getSettings("org.gnome.shell.extensions.transparent-notifications");

	const settingsPage = new Adw.PreferencesPage();
	window.add(settingsPage);

	const settingsBox = new Adw.PreferencesGroup();
	settingsBox.set_description('Configure the transparency of notifications');
	settingsPage.add(settingsBox);

		const settingsRow1 = new Adw.ActionRow();
		settingsRow1.set_title('Opacity level');
		settingsBox.add(settingsRow1);

			// invisible Gtk.SpinButton is used as value storage
			let spinButton = new Gtk.SpinButton({value: settings.get_int(OPACITY_LEVEL)});
			spinButton.set_range(0, 75);
			spinButton.set_visible(false);
			settingsRow1.add_suffix(spinButton);

			let zeroPercent = Gtk.CheckButton.new_with_label('0%');
			settingsRow1.add_suffix(zeroPercent);
			settingsRow1.set_activatable_widget(zeroPercent);
			let twentyFivePercent = Gtk.CheckButton.new_with_label('25%');
			twentyFivePercent.set_group(zeroPercent);
			settingsRow1.add_suffix(twentyFivePercent);
			settingsRow1.set_activatable_widget(twentyFivePercent);
			let fiftyPercent = Gtk.CheckButton.new_with_label('50%');
			fiftyPercent.set_group(zeroPercent);
			settingsRow1.add_suffix(fiftyPercent);
			settingsRow1.set_activatable_widget(fiftyPercent);
			let seventyFivePercent = Gtk.CheckButton.new_with_label('75%');
			seventyFivePercent.set_group(zeroPercent);
			settingsRow1.add_suffix(seventyFivePercent);
			settingsRow1.set_activatable_widget(seventyFivePercent);

		let x = settings.get_int(OPACITY_LEVEL);

		const settingsRow2 = new Adw.ActionRow();
		settingsRow2.set_title('Opacity value in gsettings is set to ' + x + '%, but it has no effect. Only default value of 75% will be used. Use the toggle below for custom values instead.');
		settingsRow2.set_title_lines(2);
		settingsRow2.set_halign(Gtk.Align.FILL);
		settingsRow2.set_hexpand(true);
		settingsRow2.set_visible(false);
		settingsBox.add(settingsRow2);

		if (x == '0') {zeroPercent.set_active(true);}
		else if (x == '25') {twentyFivePercent.set_active(true);}
		else if (x == '50') {fiftyPercent.set_active(true);}
		else if (x == '75') {seventyFivePercent.set_active(true);}
		else {settingsRow2.set_visible(true);}

		settings.bind(OPACITY_LEVEL, spinButton, 'value', Gio.SettingsBindFlags.DEFAULT);

		zeroPercent.connect('toggled', () => {spinButton.set_value('0');settingsRow2.set_visible(false)});
		twentyFivePercent.connect('toggled', () => {spinButton.set_value('25');settingsRow2.set_visible(false)});
		fiftyPercent.connect('toggled', () => {spinButton.set_value('50');settingsRow2.set_visible(false)});
		seventyFivePercent.connect('toggled', () => {spinButton.set_value('75');settingsRow2.set_visible(false)});

			const icon = new Gtk.Image();
			icon.set_from_icon_name('dialog-warning');
			icon.set_halign(Gtk.Align.CENTER);
			icon.set_hexpand(true);
			settingsRow2.add_prefix(icon);

		const settingsRow3 = new Adw.ExpanderRow();
		settingsRow3.set_title('Use custom value');
		settingsRow3.set_subtitle('This will require manually editing .css file');
		settingsRow3.set_show_enable_switch(true);
		settingsBox.add(settingsRow3);

		settings.bind(USE_CUSTOM, settingsRow3, "enable-expansion", Gio.SettingsBindFlags.DEFAULT);
		settings.bind(USE_CUSTOM, settingsRow3, "expanded", Gio.SettingsBindFlags.DEFAULT);

		function thirdRowCheck() {
			if (settingsRow3.get_enable_expansion() == true) {settingsRow1.set_sensitive(false);}
			else {settingsRow1.set_sensitive(true);}
		};

		thirdRowCheck();

		settingsRow3.connect('notify::expanded', () => thirdRowCheck());

			const customStyleHelp = new Gtk.Label();
			customStyleHelp.set_label('.customStyle rule from stylesheet.css file is being used, edit it to your preference.');
			customStyleHelp.set_vexpand(true);
			settingsRow3.add_row(customStyleHelp);

	const messageBox = new Adw.PreferencesGroup();
	settingsPage.add(messageBox);

		const messageRow = new Gtk.Label();
		messageRow.set_label('After every change, a restart of GNOME Shell is required.\nTo do that on X.Org you can press "Alt+F2", then type "r" and press Enter.\nOn Wayland you will have to log out or reboot.');
		messageRow.set_justify(Gtk.Justification.CENTER);
		messageBox.add(messageRow);
}
}