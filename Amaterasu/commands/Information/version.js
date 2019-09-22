const Command = require("../../util/Command.js");
const moment = require("moment");
const snekfetch = require("snekfetch");
const { version } = require("../../package.json");

class Version extends Command {
    constructor(client) {
      super(client, {
        name: "version",
        description: "Returns Amaterasu's version.",
        category: "Information",
        usage: "version",
        aliases: ["ver"]
      });
    }

    async run(message, args, level, settings) {
        try {
            var { body } = await snekfetch.get("https://api.github.com/repos/Amaterasu-Oomikami/Amaterasu");
        } catch (err) {
            this.client.logger.error(err);
            body = "[Error occurred whilst fetching date]";
        }
        message.channel.send(`**Version:** ${version}\n**Last updated:** ${moment.utc(body.updated_at).format("dddd Do MMMM YYYY") || body}`);
    }
}

module.exports = Version;