const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const weather = require("weather-js");

class Weather extends Command {
    constructor(client) {
      super(client, {
        name: "weather",
        description: "Displays weather information for the specified location.",
        category: "Information",
        usage: "weather <location>"
      });
    }

    async run(message, args, level, settings, texts) {
        weather.find({ search: args.join(" "), degreeType: "C" }, function(err, result) {
            if (!args[0]) return this.client.embed("commonError", message, "Please provide a place to look up weather information for.");
            if (err) return this.client.embed("APIError", message);
            try {
                var current = result[0].current;
            } catch (err) {
                if (error.message === "Cannot read property 'current' of undefined") return this.client.embed("commonError", message, "Invalid location provided.");
                if (error.message === "ESOCKETTIMEDOUT") return this.client.embed("commonError", message, "Request timed out. Please try again.");
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            }
            const location = result[0].location;
            const ct = current.temperature;
            let col;
            if (ct <= 0) col = 13431807;
            else if (ct < 0 && ct >= 5) col = 12579071;
            else if (ct >= 6 && ct <= 10) col = 11861906;
            else if (ct >= 11 && ct <= 15) col = 9238900;
            else if (ct >= 16 && ct <= 20) col = 15531898;
            else if (ct >= 21 && ct <= 25) col = 16763258;
            else if (ct >= 26 && ct <= 30) col = 16739910;
            else if (ct >= 31 && ct <= 35) col = 16730914;
            else if (ct >= 36 && ct <= 40) col = 16727074;
            else if (ct >= 40) col = 12386304;
            else col = 7654911;
            const embed = new RichEmbed()
                .setColor(col)
                .setTitle(`Weather information for ${current.observationpoint}`)
                .setDescription(stripIndents`
                The weather is **${current.skytext.toLowerCase()}** at the moment.

                • Temperature: **${ct}°C** / ${((1.8 * ct) + 32).toFixed(0)}°F
                • Feels like: **${current.feelslike}°C** / ${((1.8 * current.feelslike) + 32).toFixed(0)}°F
                • Humidity: **${current.humidity}%**
                • Wind: **${current.winddisplay.toLowerCase()}** / ~${(current.winddisplay.toLowerCase().replace(/[^0-9]/g,"") * 0.621).toFixed(1)} mph
                `)
                .setThumbnail(current.imageUrl)
                .setFooter(`Correct as of ${current.observationtime.slice(0, -3)} local time`)
                .setTimestamp();
            message.channel.send({embed});
        });
    }
}

module.exports = Weather;
