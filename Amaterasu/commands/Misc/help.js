const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Help extends Command {
    constructor (client) {
        super(client, {
            name: "help",
            description: "Returns all the available commands.",
            category: "Misc",
            usage: "help",
            aliases: ["h", "halp"]
        });
    }

    async run (message, args, level) {
        try {
            const settings = message.settings;
            const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
            const commandNames = myCommands.keyArray();
            let currentCategory = "";
            let output = "";
            let categ = [];
            const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
            sorted.forEach( c => {
                const cat = c.help.category.toProperCase();
                if (currentCategory !== cat) {
                    output += `• ${cat}\n`;
                    currentCategory = cat;
                    categ.push(currentCategory);
                    categ[currentCategory] = new Array();
                }
                categ[currentCategory].push(`${settings.prefix}${c.help.name} : ${c.help.description}`);
            });
            if (!args[0]) {
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle("📜 Command categories")
                    .setDescription(output)
                    .setFooter(`ℹ\u2000\Type ${settings.prefix}help <category> to get a list of commands in that category.`)
                message.channel.send(embed);
            } else {
                let command = args[0];
                if (categ.includes(command.toProperCase())) {
                    let outputcmd = "";
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle("📜 List of commands")
                        .setFooter(`ℹ\u2000\Type ${settings.prefix}help <command> to see the help for that specified command.`)
                    categ[command.toProperCase()].forEach( c => { outputcmd += `• ${c} \n` });
                    embed.setDescription(outputcmd)
                    message.channel.send(embed);
                } else if (this.client.commands.has(command)) {
                    command = this.client.commands.get(command);
                    if (level < this.client.levelCache[command.conf.permLevel]) {
                        return;
                    }
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`📜 ${settings.prefix}${command.help.name}`)
                        .setDescription(`• Description : ${command.help.description}\n• Usage : ${settings.prefix}${command.help.usage}\n• Aliases : ${command.conf.aliases.join(", ")}`)
                    message.channel.send(embed);
                } else {
                    message.reply("command or category not found. Please check again");
                }
            }
        } catch(err) {
            console.log(err);
            return this.client.embed(message);
        }
    }
}

module.exports = Help;
