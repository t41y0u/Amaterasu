const Command = require("../../util/Command.js");

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Displays bot latency and API response times.",
            category: "System",
            usage: "ping",
            aliases: ["pong"]
        });
    }

    async run(message, args, level) {
        try {
            const msg = await message.channel.send("Ping! 🏓");
            msg.edit(`Pong! 🏓\nMessage roundtrip took: \`${msg.createdTimestamp - message.createdTimestamp}ms\`. Heartbeat (ping): \`${Math.round(this.client.ping)}ms\`.`);
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Ping;
