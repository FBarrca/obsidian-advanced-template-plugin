import "./types/md.d.ts";
import "./styles.css";
import { Plugin } from "obsidian";
import OnboardingDialog from "./onboarding/OnboardingDialog";
import ReleaseNotes from "./onboarding/ReleaseNotes";
import { MyPluginSettings, DEFAULT_SETTINGS, SampleSettingTab } from "./settings";
import { showSvelteExample } from "./svelte-integration";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// Add command to show Svelte example
		this.addCommand({
			id: "show-svelte-example",
			name: "Show Svelte integration example",
			callback: () => {
				showSvelteExample(this.app);
			},
		});

		// First install / update checks
		await this.maybeShowOnboardingOrReleaseNotes();
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async maybeShowOnboardingOrReleaseNotes() {
		const current = this.manifest.version;
		const prev = this.settings.previousVersion;

		if (!prev) {
			// First install → show onboarding dialog
			OnboardingDialog(this);
		} else if (prev !== current) {
			// Update → show release notes
			ReleaseNotes(this);
		}

		if (prev !== current) {
			this.settings.previousVersion = current;
			await this.saveSettings();
		}
	}
}
