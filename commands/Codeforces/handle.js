const Command = require("../../util/Command.js");
const Discord = require("discord.js");
const snekfetch = require("snekfetch");
const moment = require("moment");

async function get_user(handle) {
    return await snekfetch.get("http://codeforces.com/api/user.info?handles=" + handle);
};

function check(text) {
    return text ? text : '';
}

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

class Handle extends Command {
    constructor (client) {
        super(client, {
            name: "handle",
            description: "Returns user information.",
            category: "Codeforces",
            usage: "handle <handle>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            let handle;
            if (message.mentions.members.first()) {
                const created = await this.client.handle.findOne({ where: { id: message.mentions.members.first().id } });
                if (created) {
                    handle = created.handle;
                } else {
                    return this.client.embed("commonError", message, "This user hasn't set his/her handle yet.");
                }
            } else {
                if (!args) {
                    return this.client.embed("commonError", message, "Please provide an existing Codeforces handle for me to search.");
                } else {
                    handle = args[0];
                }
            }
            let user;
            try {
                const { body } = await get_user(handle);
                user = body.result[0];
            } catch (err) {
                if (err.status && err.status === 400) return message.reply(err.body.comment);
                console.error(err);
                return this.client.embed("commonError", message, "This handle doesn't exist."); 
            }
            const lastvisit = moment.utc(new Date(user.lastOnlineTimeSeconds * 1000)).format("YYYY-MM-DDTHH:mm:ssZ");
            const registered = moment.utc(new Date(user.registrationTimeSeconds * 1000)).format("YYYY-MM-DDTHH:mm:ssZ");
            const embed = new Discord.RichEmbed()
                .setAuthor(user.rank.toProperCase())
                .setTitle(user.handle)
                .setColor(user.rank ? RANK_COLOR[user.rank.replace(/ +/, '_')] : RANK_COLOR.headquarters)
                .setDescription(`
                    ${check(user.firstName) && check(user.country) ? `${check(user.firstName)} ${check(user.lastName)}, ${check(user.country)}` : ''}
                    ${check(user.organization)}

                    **Contest rating**: ${user.rating} (**max.** ${user.maxRank}, ${user.maxRating})
                    **Contribution**: ${user.contribution <= 0 ? user.contribution : "+" + user.contribution}
                    **Friend of**: ${user.friendOfCount} user(s)
                    **Last visit**: ${moment(lastvisit, "YYYY-MM-DDTHH:mm:ssZ").fromNow()}
                    **Registered**: ${moment(registered, "YYYY-MM-DDTHH:mm:ssZ").fromNow()}
                `)
                .setURL(`http://codeforces.com/profile/${user.handle}`)
                .setThumbnail(`https:${user.avatar}`)
            message.channel.send({embed});
        } catch(err) {
            console.log(err);
            return this.client.embed("", message);
        }
    }
}

module.exports = Handle;