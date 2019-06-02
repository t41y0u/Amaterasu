const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const moment = require("moment-timezone");
const { stripIndents } = require("common-tags");

const unix = Math.round(+new Date() / 1000);

class Timezones extends Command {
    constructor(client) {
        super(client, {
            name: "timezones",
            description: "Returns a list of current times in popular timezones.",
            category: "Information",
            usage: "timezones",
            aliases: ["times", "worldtimes", "now"]
        });
    }

    async run(message, args, level) { 
        try {
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setTitle("⌚ TIMEZONES")
                .addField("❯ Africa", stripIndents`
                • EAT : [${moment().tz("Africa/Nairobi").format("HH:mm ZZ")}]
                • CAT : [${moment().tz("Africa/Maputo").format("HH:mm ZZ")}]
                • WAT : [${moment().tz("Africa/Lagos").format("HH:mm ZZ")}]
                • WEST : [${moment().tz("Africa/Accra").format("HH:mm ZZ")}]
                `)
                .addField("❯ America", stripIndents`
                • EDT : [${moment().tz("America/New_York").format("HH:mm ZZ")}]
                • CDT : [${moment().tz("America/Chicago").format("HH:mm ZZ")}]
                • MDT : [${moment().tz("America/Denver").format("HH:mm ZZ")}]
                • AKDT : [${moment().tz("America/Anchorage").format("HH:mm ZZ")}]
                • UTC-10 : [${moment().tz("Pacific/Honolulu").format("HH:mm ZZ")}]
                `)
                .addField("❯ Asia", stripIndents`
                • MVT : [${moment().tz("Indian/Maldives").format("HH:mm ZZ")}]
                • IST : [${moment().tz("Asia/Calcutta").format("HH:mm ZZ")}]
                • BTT : [${moment().tz("Asia/Dhaka").format("HH:mm ZZ")}]
                • ICT : [${moment().tz("Asia/Bangkok").format("HH:mm ZZ")}]
                • CST : [${moment().tz("Asia/Hong_Kong").format("HH:mm ZZ")}]
                `)
                .addField("❯ Europe", stripIndents`
                • UTC/GMT : [${moment.utc().format("HH:mm ZZ")}]
                • BST : [${moment().tz("Europe/London").format("HH:mm ZZ")}]
                • CEST : [${moment().tz("Europe/Zurich").format("HH:mm ZZ")}]
                • EEST : [${moment().tz("Europe/Helsinki").format("HH:mm ZZ")}]
                • FET : [${moment().tz("Europe/Minsk").format("HH:mm ZZ")}]
                `)
                .addField("❯ Oceania", stripIndents`
                • AWST : [${moment().tz("Australia/Perth").format("HH:mm ZZ")}]
                • ACST : [${moment().tz("Australia/Darwin").format("HH:mm ZZ")}]
                • AEST : [${moment().tz("Australia/Sydney").format("HH:mm ZZ")}]
                • NZST : [${moment().tz("Pacific/Auckland").format("HH:mm ZZ")}]
                `)
                .addField("❯ Other", stripIndents`
                • UNIX : [${unix}]
                `)
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err);
            return this.client.embed("", message);
        }
    }
}

module.exports = Timezones;