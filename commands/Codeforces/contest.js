const Command = require("../../util/Command.js");
const Discord = require("discord.js");
const snekfetch = require("snekfetch");

async function get_contest() {
    return await snekfetch.get("https://codeforces.com/api/contest.list?gym=false");
};

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

function timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const year = a.getFullYear();
    const month = formatTime(a.getMonth() + 1);
    const date = formatTime(a.getDate());
    const hour = formatTime(a.getHours());
    const min = formatTime(a.getMinutes());
    const time = hour + ":" + min + "\n" + month + "/" + date + "/" + "/" + year;
    return time;
}

class Contest extends Command {
    constructor (client) {
        super(client, {
            name: "contest",
            description: "Retrieve list of yet to start contests filtered by (optional) division number.",
            category: "Codeforces",
            usage: "contest [division]",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            let div;
            if (args.length) {
                div = Number.parseInt(args[0]);
                if (Number.isNaN(div) || div < 0 || div > 3) {
                    return this.client.embed("commonError", message, `${args[0]} is not a valid division number.`);
                    return;
                }
            }
            let result;
            try {
                const { body } = await get_contest();
                result = body.result;
            } catch(err) {
                console.log(err);
                return this.client.embed("APIError", message);
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
                return this.client.embed("commonError", message, `${reply}`);
            }
            for (const v of valid) {
                const embed = new Discord.RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(v.name)
                    .setURL(`http://codeforces.com/contests/${v.id}`)
                    .addField("Type", v.type);
                if (v.startTimeSeconds) embed.addField('Starting', timeConverter(v.startTimeSeconds));
                if (v.preparedBy) embed.addField('Author', v.preparedBy);
                if (v.difficulty) embed.addField('Difficulty', v.difficulty);
                message.channel.send({embed});
            }
        } catch(err) {
            console.log(err);
            return this.client.embed("", message);
        }
    }
}

module.exports = Contest;