module.exports = class {
  	constructor (client) {
    	this.client = client;
  	}

  	async run (guild) {
    	this.client.user.setActivity(`${this.client.settings.get("default").prefix}help | ${this.client.guilds.size} Servers`);
    	this.client.settings.delete(guild.id);
    	this.client.logger.log(`Left guild: ${guild.name} (${guild.id}) with ${guild.memberCount} members`);
  	}
};
