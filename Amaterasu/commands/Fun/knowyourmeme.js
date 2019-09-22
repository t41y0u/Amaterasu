const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("node-superfetch");
const cheerio = require("cheerio");

class KnowYourMeme extends Command {
    constructor(client) {
        super(client, {
            name: "knowyourmeme",
            description: "Searches Know Your Meme for the specified query.",
            category: "Fun",
            usage: "knowyourmeme <query>",
            aliases: ["kym", "know-your-meme", "meme-info", "meme-search"]
        });
    }

    async run(message, args, level) {
        const query = args.join(" ");
        if (!query) {
            return this.client.embed("commonError", message, "Please provide a query for me search from the knowyourmeme database.");
        }
        try {
            async function search(query) {
                const { text } = await request
                    .get("https://knowyourmeme.com/search")
                    .query({ q: query });
                const $ = cheerio.load(text);
                const location = $(".entry-grid-body").find("tr td a").first().attr("href");
                if (!location) return null;
                return location;
            }
            const location = await search(query);
            if (!location) return this.client.embed("noSearchResults", message);
            function getMemeDescription($) {
                const children = $(".bodycopy").first().children();
                let foundAbout = false;
                for (let i = 0; i < children.length; i++) {
                    const text = children.eq(i).text();
                    if (foundAbout) {
                        if (text) return text;
                    } else if (text === "About") {
                        foundAbout = true;
                    }
                }
                return null;
            }
            async function fetchMeme(location) {
                const { text } = await request.get(`https://knowyourmeme.com${location}`);
                const $ = cheerio.load(text);
                const thumbnail = $('a[class="photo left wide"]').first().attr("href") || $('a[class="photo left "]').first().attr("href") || null;
                return {
                    name: $("h1").first().text().trim(),
                    url: `https://knowyourmeme.com${location}`,
                    description: getMemeDescription($),
                    thumbnail
                };
            }
            const data = await fetchMeme(location);
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor("Know Your Meme", "https://i.imgur.com/WvcH4Z2.png", "https://knowyourmeme.com/")
                .setTitle(data.name)
                .setDescription(data.description ? (data.description.length > 2000 ? `${data.description.substr(0, 2000 - 3)}...` : data.description) : "No description available.")
                .setURL(data.url)
                .setThumbnail(data.thumbnail)
            return message.channel.send({embed});
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        } 
    }
}

module.exports = KnowYourMeme;