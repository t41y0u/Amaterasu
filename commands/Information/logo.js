const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Logo extends Command {
    constructor(client) {
      super(client, {
        name: "logo",
        description: "Sends a website's logo.",
        category: "Information",
        usage: "logo <url>"
      });
    }

    async run(message, args, level) { 
        const query = args[0];
        if (!query) return this.client.embed("commonError", message, "Invalid URL provided.");
        const url = `https://logo.clearbit.com/${query.startsWith("<") ? query.replace(/<(.+)>/g, "$1") : query}?size=500`;
        fetch(url)
            .then(res => message.channel.send({ files: [{ attachment: res.body, name: "logo.jpg" }] }))
            .catch(err => {
                if (error.message === "404 Not Found") return message.channel.send(texts.general.noResultsFound);
                this.client.logger.error(err);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = Logo;
