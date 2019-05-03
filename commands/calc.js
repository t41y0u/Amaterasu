const Command = require("../base/Command.js");
const { RichEmbed } = require("discord.js");
const math = require('mathjs');

class Calc extends Command {
    constructor (client) {
        super(client, {
            name: "calc",
            description: "Calculate the given expressions.",
            usage: "calc <expression>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const exp = args.join("");
        if (!exp) {
            return message.reply("please provide a valid expression");
        }
        if (exp.length > 1010) {
            return message.reply("expression is too long!");
        }
        let result;
        try {
            result = math.eval(exp);
        } catch (error) {
            console.log('Failed math calculation ' + exp.content + '\nError: ' + e.stack);
            return message.reply("error while evaluating the math expression.");
        } finally {
            if (isNaN(parseFloat(result))) {
                message.reply("Invalid Calculation Expression");
            } else {
                let embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(`Evaluated in ${Math.round(this.client.ping)}ms`)
                    .addField(":inbox_tray: Input", `\`\`\`js\n${exp}\n\`\`\``)
                    .addField(":outbox_tray: Output", `\`\`\`js\n${result}\n\`\`\``)
                message.channel.send(embed);
            }
        }
    }
}

module.exports = Calc;
