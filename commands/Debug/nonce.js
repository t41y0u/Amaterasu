const Command = require("../../util/Command.js");

class Nonce extends Command {
    constructor(client) {
        super(client, {
            name: "nonce",
            description: "Sends a random number string used for checking message delivery.",
            category: "Debug",
            usage: "nonce",
            permLevel: "Bot Admin"
        });
    }

    async run(message, args, level) {
        try {
            const msg = await message.channel.send(message.nonce);
            msg.edit(`${message.nonce}\nDelivery time: **${msg.createdTimestamp - message.createdTimestamp}**ms.`);
        } catch (err) {
            this.client.logger.error(`Message delivery failed in guild "${message.guild.name}" (${message.guild.id}).`);
            return this.client.embed("", message);
        }
    }
}

module.exports = Nonce;
