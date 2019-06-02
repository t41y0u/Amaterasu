const Command = require("../../util/Command.js");

class Reboot extends Command {
    constructor(client) {
        super(client, {
            name: "reboot",
            description: "If running under PM2, the bot will restart.",
            category: "System",
            usage: "reboot",
            aliases: ["restart"],
            permLevel: "Bot Admin"
        });
    }

    async run(message, args, level) {
        try {
            await message.channel.send("Rebooting, please wait...");
            this.client.commands.forEach(async cmd => {
                await this.client.unloadCommand(cmd);
            });
            process.exit(1);
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Reboot;