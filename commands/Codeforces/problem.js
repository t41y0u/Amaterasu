const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

async function get_problems(tags) {
    const params = tags.join(';');
    return await snekfetch.get("http://codeforces.com/api/problemset.problems?tags=" + params);
};

class Problem extends Command {
    constructor (client) {
        super(client, {
            name: "problem",
            description: "Retrieve a random problem with (optional) provided tags.",
            category: "Codeforces",
            usage: "problem [difficulty] [tags1] [tags2] ...",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            const specifiers = args.map(arg => arg.split('_').join(' '));
            let result;
            let tags = specifiers.slice();
            if (Number.isInteger(Number(specifiers[0]))) {
                if (Number(specifiers[0]) < 500 || Number(specifiers[0]) > 3800 || isNaN(Number(specifiers[0]))) return this.client.embed("commonError", message, "Difficulty should be a number between 500 and 3800.");
                tags.shift();
            }
            try {
                const { body } = await get_problems(tags);
                result = body.result;
            } catch(err) {
                if (err.status && err.status === 400) return this.client.embed("commonError", message, "Tags should contain only lowercase letters, numbers, spaces and hifens (-). You can look on the available tags [here](http://codeforces.com/blog/entry/14565)");
                console.log(err);
                return this.client.embed("commonError", message, "Found no problems with the specified tags.");
            }
            if (!Number.isInteger(Number(specifiers[0]))) {
                const { problems } = result;
                const idx = Math.floor(Math.random() * (problems.length - 1));
                const { name, contestId, index, tags, rating } = problems[idx];
                const { solvedCount } = result.problemStatistics[idx];
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(name)
                    .setURL(`http://codeforces.com/contest/${contestId}/problem/${index}`)
                    .addField("Contest", `${contestId}${index}`)
                    .addField("Difficulty", rating)
                    .addField("Accepted(s)", `${solvedCount} time(s)`)
                    .addField("Tags", tags.join(", "))
                message.channel.send({embed});
            } else {
                const { problems } = result;
                let idx;
                do {
                    idx = Math.floor(Math.random() * (problems.length - 1));
                } while (problems[idx].rating !== Number(specifiers[0]));
                const { name, contestId, index, tags, rating } = problems[idx];
                const { solvedCount } = result.problemStatistics[idx];
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(name)
                    .setURL(`http://codeforces.com/contest/${contestId}/problem/${index}`)
                    .addField("Contest", `${contestId}${index}`)
                    .addField("Difficulty", rating)
                    .addField("Accepted(s)", `${solvedCount} time(s)`)
                    .addField("Tags", tags.join(", "))
                message.channel.send({embed});
            }
        } catch(err) {
            console.log(err);
            return this.client.embed("commonError", message, "Found no problems with specified tags or difficulty.\nRemember : Tags should contain only lowercase letters, numbers, spaces and hifens (-). You can look on the available tags [here](http://codeforces.com/blog/entry/14565)");
        }
    }
}

module.exports = Problem;