const Command = require("../base/Command.js");
const Discord = require("discord.js");
const weather = require("weather-js");

class Weather extends Command {
    constructor (client) {
        super(client, {
            name: "weather",
            description: "Displays the weather of a certain place.",
            category: "Info",
            usage: "weather <place>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        weather.find({search: args.join(" "), degreeType: "C"}, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (result === undefined || result.length === 0) {
                return message.reply("please provide a city!");
            }
            const current = result[0].current;
            const location = result[0].location;
            const embed = new Discord.RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor(`Weather for ${current.observationpoint}`)
                .setDescription(`**${current.skytext}**`)
                .addField("Timezone", `UTC${location.timezone < 0 ? location.timezone : "+" + location.timezone}`, true)
                .addField("Temperature", `${current.temperature}°C`, true)
                .addField("Feels like", `${current.feelslike}°C`, true)
                .addField("Winds", current.winddisplay, true)
                .addField("Humidity", `${current.humidity}%`, true)
                .addField("Observation Time", `${current.observationtime} ${current.date} (${current.day})`, true)
                .setThumbnail(current.imageUrl)
                .setFooter(`Requested by ${message.member.user.tag}`)
            message.channel.send({embed});
        })
    }
}

module.exports = Weather;
