const Command = require("../../util/Command.js");
const fetch = require("node-fetch");
const h = new (require("html-entities").AllHtmlEntities)();

class NASA extends Command {
    constructor(client) {
        super(client, {
            name: "nasa",
            description: "Searches NASA's image database.",
            category: "Information",
            usage: "nasa <image>",
            aliases: ["space"]
        });
    }

    async run(message, args, level, settings, texts) {
        let query = args.join(" ");
        if (!query) return this.client.embed("commonError", message, "Please provide a query to search NASA's image database for.");
        else query = encodeURIComponent(args.join(" "));
        fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`)
            .then(res => res.json())
            .then(body => {
                const images = body.collection.items;
                if (!images.length || images.length === 0) return this.client.embed("commonError", message, "No results found.");
                const data = images.random();
                const description = h.decode(data.data[0].description).replace(/href="([^"]*)"[^>]*>([^<]*)</g, '>[$2]($1)<').replace(/<[^>]*>/g, '');
                message.channel.send(description.length > 1997 ? description.substring(0, 1997) + "..." : description.substring(0, 2000), {
                    file: data.links[0].href
                });
            })
            .catch(err => {
                this.client.logger.error(err);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = NASA;
