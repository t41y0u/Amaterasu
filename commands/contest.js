const Command = require("../base/Command.js");
const Discord = require("discord.js");
const snekfetch = require("snekfetch");

const get_contest = async function() {
    return await snekfetch.get("https://codeforces.com/api/contest.list?gym=false");
};

class Contest extends Command {
    constructor (client) {
        super(client, {
            name: "contest",
            description: "Retrieve list of yet to start contests filtered by (optional) division number.",
            category: "Codeforces",
            usage: "contest [division]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let div;
        if (args.length) {
            div = Number.parseInt(args[0]);
            if (Number.isNaN(div) || div < 0 || div > 3) {
                message.reply(`${args[0]} is not a valid division number!`);
                return;
            }
        }
        let result;
        try {
            const { body } = await get_contest();
            result = body.result;
        } catch(err) {
            console.error(err);
            return message.reply("an error occured while processing the request.");
        }
        const valid = [];
        for (const r of result) {
            if (r.phase !== 'BEFORE') {
                continue;
            }
            if (div === undefined || r.name.includes(`Div. ${div}`)) {
                valid.push(r);
            }
        }
        if (!valid.length) {
            let reply = 'found no contests';
            if (div !== undefined) {
                reply += ` for division ${div}`;
            }
            message.reply(reply);
            return;
        }
        for (const v of valid) {
            const embed = new Discord.RichEmbed()
                .setColor(0x00FFFF)
                .setTitle(v.name)
                .setURL(`http://codeforces.com/contests/${v.id}`)
                .addField("Type", v.type);
            if (v.startTimeSeconds) {
                embed.addField('Starting', new Date(v.startTimeSeconds * 1000).toString());
            }
            if (v.preparedBy) {
                embed.addField('Author', v.preparedBy);
            }
            if (v.difficulty) {
                embed.addField('Difficulty', v.difficulty);
            }
            message.channel.send({embed});
        }
    }
}

module.exports = Contest;