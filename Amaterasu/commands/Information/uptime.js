const Command = require("../../util/Command.js");
const moment = require("moment");
require("moment-duration-format");

class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: "uptime",
            description: "Displays Amaterasu's uptime.",
            category: "Information",
            usage: "uptime"
        });
    }

    async run(message, args, level, settings) {
        try {
            const uptime = moment.duration(this.client.uptime).format("D [days], H [hrs], m [mins], s [secs]");
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle(`Uptime : ${uptime}.`);
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Uptime;