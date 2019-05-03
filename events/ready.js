module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run () {
        await this.client.wait(1000);
        this.client.appInfo = await this.client.fetchApplication();
        setInterval( async () => {
            this.client.appInfo = await this.client.fetchApplication();
        }, 60000);
        if (!this.client.settings.has("default")) {
            if (!this.client.config.defaultSettings) {
                throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
            }
            this.client.settings.set("default", this.client.config.defaultSettings);
        }
        this.client.user.setActivity(`with Sakuta-kun • ${this.client.config.defaultSettings.prefix}help`);
        this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, "ready");
    }
};
