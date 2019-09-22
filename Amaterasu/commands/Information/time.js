const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Time extends Command {
    constructor(client) {
        super(client, {
            name: "time",
            description: "Returns the current time in a specified timezone.",
            category: "Information",
            usage: "time <continent>/<city>",
            aliases: ["timezone", "worldtime"]
        });
    }

    async run(message, args, level) {
        const link = "https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List";
        const timeZone = args.join("_").toUpperCase();
        if (!timeZone) return this.client.embed("commonError", message, `You must provide a timezone to look up the time for. For a full list of timezones, refer to the "TZ" column here: **<${link}>**.`);
        try {
            const time = new Date().toLocaleTimeString("en-GB", { timeZone, hour12: false });
            const friendly = timeZone.substring(timeZone.indexOf("/") + 1).replace(/_/g, " ");
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle("⌚ Time").setDescription(`The time in **${friendly.toProperCase()}** is currently **${time}**.`);
            return message.channel.send({embed});
        } catch (err) {
            this.client.logger.error(err);
            return this.client.embed("commonError", message, `You must provide a timezone to look up the time for. For a full list of timezones, refer to the "TZ" column [here](${link}).`);
        }
    }
}

module.exports = Time;