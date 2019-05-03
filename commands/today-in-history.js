const Command = require("../base/Command.js");
const Discord = require("discord.js");
const fetch = require("node-superfetch");

class TodayinHistory extends Command {
    constructor (client) {
        super(client, {
            name: "today-in-history",
            description: "Returns information about history events that happened today.",
            category: "Info",
            usage: "today-in-history [month] [date]",
            guildOnly: true,
            aliases: ["tih"]
        });
    }

    async run (message, args, level) {
        let month, day;
        if (!args[0]) {
            const today = new Date();
            month = today.getMonth() + 1;
            day = today.getDate();
        } else {
            month = Number(args[0]);
            day = Number(args[1]);
            if (isNaN(month)) {
                return message.reply('please enter a valid month!');
            }
            if (isNaN(day)) {
                return message.reply('please enter a valid date!');
            }
        }
        try {
            const { text } = await fetch.get(`http://history.muffinlabs.com/date/${month}/${day}`);
            const body = JSON.parse(text);
            const events = body.data.Events;
            const event = events[Math.floor(Math.random() * events.length)];
            const embed = new Discord.RichEmbed()
                .setColor(0x00FFFF)
                .setURL(body.url)
                .setTitle(`On this day (${body.date})...`)
                .setDescription(`${event.year}: ${event.text}`)
                .addField('❯ See More', event.links.map(link => `[${link.title}](${link.link.replace(/\)/g, '%29')})`).join(', '));
            return message.channel.send({embed});
        } catch (err) {
            console.log(err);
            return message.reply("an error occurred while processing your request!");
        }
    }
}

module.exports = TodayinHistory;