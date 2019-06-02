const Command = require("../../util/Command.js");
const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

class Snake extends Command {
    constructor(client) {
        super(client, {
            name: "snake",
            description: "Sends a random image of a snake.",
            category: "Image",
            usage: "snake",
            aliases: ["snek"]
        });
    }

    async run(message, args, level, settings, texts) {
        const page = Math.floor(Math.random() * 5) + 1;
        const index = Math.floor(Math.random() * 10) + 1;
        const meta = { "Authorization": `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` };
        message.channel.startTyping();
        fetch(`https://api.unsplash.com/search/photos?page=${page}&query=snake`, { headers: meta })
            .then(res => res.json())
            .then(json => {
                const data = json.results[parseInt(index.toFixed(0))];
                const embed = new RichEmbed()
                    .setTitle("🐍 Snake")
                    .setURL(data.urls.raw)
                    .setDescription(`Photo by [${data.user.name}](${data.user.links.html}) on [Unsplash](https://unsplash.com)`)
                    .setImage(data.urls.raw)
                    .setColor(randomColor)
                    .setTimestamp();
                message.channel.send({ embed });
            })
            .catch(error => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = Snake;
