const Command = require("../../util/Command.js");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

class Giphy extends Command {
    constructor(client) {
        super(client, {
            name: "giphy",
            description: "Returns a GIF from Giphy based on your query.",
            category: "Image",
            usage: "giphy <query>",
            aliases: ["gif"]
        });
    }

    async run(message, args, level) {
        const query = args[0];
        if (!query) return this.client.embed("commonError", message, "Please provide a query for me to search on Giphy."); 
        const url = "http://api.giphy.com/v1/gifs/search?";
        const params = new URLSearchParams({
            q: query,
            api_key: process.env.GIPHY_API_KEY,
            rating: "pg"
        });
        fetch(url + params)
            .then(res => res.json())
            .then(json => message.channel.send(json.data.random().images.original.url))
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = Giphy;
