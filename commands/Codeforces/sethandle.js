const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const snekfetch = require("snekfetch");

async function get_user(handle) {
    return await snekfetch.get("http://codeforces.com/api/user.info?handles=" + handle);
};

class SetHandle extends Command {
    constructor (client) {
        super(client, {
            name: "sethandle",
            description: "Sets handle of an user.",
            category: "Codeforces",
            usage: "sethandle <handle>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            if (!args) return this.client.embed("commonError", message, "Please provide an existing Codeforces handle for me to set.");
            let user;
            try {
                const { body } = await get_user(args[0]);
                user = body.result[0];
            } catch (err) {
                if (err.status && err.status === 400) return message.reply(err.body.comment);
                console.error(err);
                return this.client.embed("commonError", message, "This handle doesn't exist."); 
            }
            const created = await this.client.handle.findOne({ where: { id: message.author.id } });
            if (created) {
                await this.client.handle.update({ handle: args[0] }, { where: { id: message.author.id } });
            } else {
                await this.client.handle.create({ id: message.author.id, handle: args[0] });
            }
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor("✅️ Success")
                .setDescription(`Your handle has been successfully set to ${args}`)
            message.channel.send({embed});
        } catch (err) {
            console.error(err);
            return this.client.embed("commonError", message, "This handle doesn't exist."); 
        }
    }
}

module.exports = SetHandle;