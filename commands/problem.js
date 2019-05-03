const Command = require("../base/Command.js");
const Discord = require("discord.js");
const snekfetch = require("snekfetch");

const get_problem = async function(tags) {
    const params = tags.join(';');
    return await snekfetch.get("http://codeforces.com/api/problemset.problems?tags=" + params);
};

class Problem extends Command {
    constructor (client) {
        super(client, {
            name: "problem",
            description: "Retrieve a random problem with (optional) provided tags.",
            category: "Codeforces",
            usage: "problem [tags1] [tags2] ...",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const user_tags = args.map(arg => arg.split('_').join(' '));
        let result;
        try {
            const { body } = await get_problem(user_tags);
            result = body.result;
        } catch(err) {
            if (err.status && err.status === 400) {
                message.reply("tags should contain only lowercase letters, numbers, spaces and hifens (-). You can look on the available tags here: http://codeforces.com/blog/entry/14565");
                return;
            }
            console.error(err);
            return message.reply("an error occured while processing the request.");
        }
        const { problems } = result;
        if (!problems.length) {
            return message.reply('found no problems with the specified tags.');
        }
        const r = Math.floor(Math.random() * (problems.length - 1));
        const { name, contestId, index, tags } = problems[r];
        const { solvedCount } = result.problemStatistics[r];
        const embed = new Discord.RichEmbed()
            .setColor(0x00FFFF)
            .setTitle(name)
            .addField("Contest", `${contestId}/${index}`)
            .addField("Accepted(s)", `${solvedCount} time(s)`)
            .addField("Tags", tags.join(', '))
            .setURL(`http://codeforces.com/contest/${contestId}/problem/${index}`);
        message.channel.send({embed});
    }
}

module.exports = Problem;