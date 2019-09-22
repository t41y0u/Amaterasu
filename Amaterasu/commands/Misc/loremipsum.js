const Command = require("../../util/Command.js");
const { get } = require("snekfetch");

class LoremIpsum extends Command {
    constructor(client) {
        super(client, {
            name: "loremipsum",
            description: "Need placeholder text for your website? Look no further.",
            category: "Misc",
            usage: "loremipsum",
            aliases: ["placeholder", "lorem", "lorem-ipsum"]
        });
    }

    async run(message, args, level) { 
        try {
            const { raw } = await get("https://loripsum.net/api").set("Accept", "text/plain");
            const text = raw.toString();
            message.channel.send(text.length >= 2000 ? text.substring(0, 1980) + "... </p>" : text, { code: "html" });
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = LoremIpsum;
