const Command = require("../../util/Command.js");
const fetch = require("node-fetch");
const { RichEmbed } = require("discord.js");

class ImageSearch extends Command {
    constructor(client) {
        super(client, {
            name: "imagesearch",
            description: "Sends a random image based on your query.",
            category: "Image",
            usage: "imagesearch <query>",
            aliases: ["isearch", "i-search", "image-search"]
        });
    }

    async run(message, args, level, settings, texts) {
        let query = args.join(" ");
        if (!query) return this.client.embed("commonError", message, "Please provide a query for me to search."); 
        else query = encodeURIComponent(args.join(" "));
        const page = Math.floor(Math.random() * 5) + 1;
        const index = Math.floor(Math.random() * 10) + 1;
        const meta = { "Authorization": `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` };
        message.channel.startTyping();
        fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${query}`, { headers: meta })
            .then(res => res.json())
            .then(json => {
                const data = json.results[parseInt(index.toFixed(0))];
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle("📷 Image")
                    .setURL(data.urls.raw)
                    .setDescription(`Photo by [${data.user.name}](${data.user.links.html}) on [Unsplash](https://unsplash.com)`)
                    .setImage(data.urls.raw)
                    .setTimestamp();
                message.channel.send({ embed });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = ImageSearch;
