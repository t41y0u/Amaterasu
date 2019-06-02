const Command = require("../../util/Command.js");

class Shutdown extends Command {
    constructor(client) {
        super(client, {
            name: "shutdown",
            description: "Shuts down Amaterasu.",
            category: "System",
            usage: "shutdown",
            aliases: ["kill", "endprocess", "shut-down"],
            permLevel: "Bot Owner"
        });
    }

    async run(message, args, level) {
        try {
            await message.channel.send("Shutting down... :wave:");
            this.client.commands.forEach(async cmd => {
                await this.client.unloadCommand(cmd);
            });
            process.exit();
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Shutdown;