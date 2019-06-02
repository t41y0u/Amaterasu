const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-superfetch");

class TodayinHistory extends Command {
    constructor (client) {
        super(client, {
            name: "today-in-history",
            description: "Returns information about history events that happened today.",
            category: "Misc",
            usage: "today-in-history [month] [date]",
            guildOnly: true,
            aliases: ["tih"]
        });
    }

    async run (message, args, level) {
        try {
            let month, day;
            if (!args[0]) {
                const today = new Date();
                month = today.getMonth() + 1;
                day = today.getDate();
            } else {
                month = Number(args[0]);
                day = Number(args[1]);
                if (isNaN(month)) {
                    return this.client.embed("commonError", message, "Please provide a valid month!");
                }
                if (isNaN(day)) {
                    return this.client.embed("commonError", message, "Please provide a valid date!");
                }
            }
            try {
                const { text } = await fetch.get(`http://history.muffinlabs.com/date/${month}/${day}`);
                const body = JSON.parse(text);
                const events = body.data.Events;
                const event = events[Math.floor(Math.random() * events.length)];
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setURL(body.url)
                    .setTitle(`On this day (${body.date})...`)
                    .setDescription(`${event.year}: ${event.text}`)
                    .addField('❯ See More', event.links.map(link => `[${link.title}](${link.link.replace(/\)/g, '%29')})`).join(', '));
                return message.channel.send({embed});
            } catch(err) {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            };
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = TodayinHistory;