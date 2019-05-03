const Command = require("../base/Command.js");
const Discord = require("discord.js");
const snekfetch = require("snekfetch");

const get_user = async function(handles) {
    const params = handles.join(';');
    return await snekfetch.get("http://codeforces.com/api/user.info?handles=" + params);
};

const RANK_COLOR = {
    newbie: [128, 128, 128],
    pupil: [35, 145, 35],
    specialist: [37, 180, 171],
    expert: [0, 0, 255],
    candidate_master: [170, 0, 170],
    master: [255, 140, 0],
    international_master: [255, 140, 0],
    grandmaster: [255, 0, 0],
    international_grandmaster: [255, 0, 0],
    legendary_grandmaster: [255, 0, 0],
    headquarters: [0, 0, 0],
};

class User extends Command {
    constructor (client) {
        super(client, {
            name: "user",
            description: "Returns user information. Maximum of 3 users per request.",
            category: "Codeforces",
            usage: "user [handle1] [handle2] [handle3]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (args.length > 3) {
            return message.reply('no more than 3 handles accepted.');
        }
        let users;
        try {
            const { body } = await get_user(args);
            users = body.result;
        } catch (err) {
            if (err.status && err.status === 400) {
                return message.reply(err.body.comment);
            }
            console.error(err);
            return message.reply("an error occured while processing the request");
        }
        for (const user of users) {
            const embed = new Discord.RichEmbed()
                .setTitle(user.handle)
                .setThumbnail(`https:${user.avatar}`)
                .addField('Name', `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''}`)
                .addField('Rank', `${user.rank} (${user.rating})`)
                .setURL(`http://codeforces.com/profile/${user.handle}`);
            const color = user.rank ? RANK_COLOR[user.rank.replace(/ +/, '_')] : RANK_COLOR.headquarters;
            embed.setColor(color);
            message.channel.send({embed});
        }
    }
}

module.exports = User;