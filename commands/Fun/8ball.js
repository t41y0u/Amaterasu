const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class EightBall extends Command {
    constructor (client) {
        super(client, {
            name: "8ball",
            description: "Returns an answer to any question!",
            category: "Fun",
            usage: "8ball <question>",
            guildOnly: true,
            aliases: ["8-ball, eightball, fortune"]
        });
    }

    async run (message, args, level) {
        try {
            const eightball = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don\'t count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
            if (args[0]) {
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setAuthor(`🎱 ${args.join(" ")}`)
                    .setDescription(`❯  ${eightball[Math.floor(Math.random() * eightball.length).toString(10)]}`)
                    .setFooter(`Requested by ${message.member.user.tag}`, message.member.user.displayAvatarURL)
                    .setTimestamp()
                message.channel.send(embed);
            } else {
                this.client.embed("commonError", message, "Please provide a question for me to answer."); 
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = EightBall;
