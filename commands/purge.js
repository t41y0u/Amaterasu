const Command = require("../base/Command.js");

class Purge extends Command {
    constructor (client) {
        super(client, {
            name: "purge",
            description: "Deletes a number of messages (max. 100).",
            category: "Mods",
            usage: "purge <number>",
            guildOnly: true,
            aliases: ["none"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) {
        if (!message.member.hasPermission("MANAGE_MESSAGES") && message.member.id !== this.client.config.owner) {
            return message.reply("you don't have the permissions to use this command!");
        }
        const deleteCount = Number(args[0]);
        if (!deleteCount || deleteCount < 1 || deleteCount > 100) {
            return message.reply("please provide a number between 1 and 100 for the number of messages to delete");
        }
        const fetched = await message.channel.fetchMessages({limit: (deleteCount + 1)});
        message.channel.bulkDelete(fetched).catch(error => message.reply(`Kaguya-chan couldn't delete messages because of: ${error}`));
        message.reply(`${deleteCount} messages have been deleted`).then(reply => reply.delete(5000).catch(O_o => {})).catch(console.error);
    }
}

module.exports = Purge;
