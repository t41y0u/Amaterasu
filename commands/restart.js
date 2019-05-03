const Command = require("../base/Command.js");

class Restart extends Command {
    constructor (client) {
        super(client, {
            name: "restart",
            description: "Restarts Kaguya-chan.",
            category: "System",
            usage: "restart",
            aliases: ["none"],
            permLevel: "Bot Owner"
        });
    }

    async run (message, args, level) {
        message.channel.send('Restarting...')
            .then(msg => this.client.destroy())
            .then(() => this.client.login(this.client.config.token))
            .then(() => message.channel.send("I'm back!"));
    }
}

module.exports = Restart;
