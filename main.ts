import {
	App, Editor, MarkdownView, Modal, Notice, Command,
	Plugin, PluginSettingTab, Setting
} from 'obsidian';

interface WeeksLeftSettings {
	pastWeekCharacter: string;
	pendingWeekCharacter: string;

	birthDate: string;
	deathDate: string;
	birth: Date;
	death: Date;
}

const DEFAULT_SETTINGS: WeeksLeftSettings = {
	birthDate: '1977-01-01',
	deathDate: '1977-01-01',
	birth: new Date('1977-01-01'),
	death: new Date('1977-01-01'),
	pastWeekCharacter: '▪',
	pendingWeekCharacter: '▫'
}

// TODO: move to class
const MiniMapCommand: Command = {
	id: "weeksleft-add-minimap",
	name: "Add Minimap",
	editorCallback: (editor: Editor, viewContext: MarkdownView) => {
		console.log(editor.getSelection());
		let deathWeek = 51;
		let weeks = new Array(51)
		let currentWeek = 20

		for (let week = 0; week < deathWeek; week++) {
			if (week <= currentWeek) {
				weeks[week] = DEFAULT_SETTINGS.pastWeekCharacter;
			} else {
				weeks[week] = DEFAULT_SETTINGS.pendingWeekCharacter;
			}
		}

		editor.replaceSelection(weeks.join(""));
	}
}

export default class WeeksLeft extends Plugin {
	settings: WeeksLeftSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		this.addCommand(MiniMapCommand);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeeksLeftSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class WeeksLeftSettingsTab extends PluginSettingTab {
	plugin: WeeksLeft;

	constructor(app: App, plugin: WeeksLeft) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'WeeksLeft Settings' });

		new Setting(containerEl)
			.setName('BirthDate')
			.setDesc('Date of Birth')
			.addText(text => text
				.setPlaceholder('Enter Your Date of Birth')
				.setValue(this.plugin.settings.birthDate)
				.onChange(async (value) => {
					console.log('Date of Birth: ' + value);
					this.plugin.settings.birthDate = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('DeathDate')
			.setDesc('Date of Death')
			.addText(text => text
				.setPlaceholder('Enter Your Date of Death')
				.setValue(this.plugin.settings.deathDate)
				.onChange(async (value) => {
					console.log('Date of Death: ' + value);
					this.plugin.settings.deathDate = value;
					await this.plugin.saveSettings();
				}));
	}
}
