const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const cleverbot = require("cleverbot.io");
const bot = new cleverbot(process.env.CLEVERBOT_API_USER, process.env.CLEVERBOT_API_KEY);

class CleverBot extends Command {
    constructor (client) {
        super(client, {
            name: "cleverbot",
            description: "Talks with the bot!",
            category: "Fun",
            usage: "cleverbot <query>",
            guildOnly: true,
            aliases: ["cb"]
        });
    }

    async run (message, args, level) {
        try {
            const query = args.join(" ");
            if (!query) return this.client.embed("commonError", message, "You must provide some contexts for me to interact with.");
            bot.setNick("Amaterasu");
            bot.create();
            message.channel.startTyping();
            bot.ask(query, function (error, response) {
                if (error) {
                    message.channel.stopTyping(true);
                    return message.channel.send("An error occurred. Please try again later.");
                }
                return message.channel.send(response.includes("Cleverbot") ? response.replace(/Cleverbot/g, "Amaterasu") : response);
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = CleverBot;