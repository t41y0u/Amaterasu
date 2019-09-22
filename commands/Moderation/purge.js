const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Purge extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            description: "Purges (bulk-deletes) between 2 and 99 messages.",
            category: "Moderation",
            usage: "purge <@user> [number]",
            aliases: ["prune", "delet", "bulkdelete"],
            permLevel: "Moderator",
            guildOnly: true
        });
    }

    async run(message, args, level) {
        if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle("❌ Error").setDescription("I cannot delete messages, make sure I have the proper permissions!");
            return message.channel.send({embed});
        }
        message.delete().catch(O_o=>{});
        const user = message.mentions.users.first();
        let amount = parseInt(message.content.split(" ")[1]) ? parseInt(message.content.split(" ")[1]) : parseInt(message.content.split(" ")[2]);
        if (!amount && !user) return message.channel.send(`You must specify a user and amount, or just an amount, of messages to purge.`);
        if (!amount) return message.channel.send("You must specify an amount to delete.");
        if (amount < 2 || amount > 99) return message.channel.send("You've provided an invalid number of messages to delete. Please ensure it's between 2 and 99 (inclusive).");
        let messages = await message.channel.fetchMessages({ limit: amount });
        if (user) {
            const filterBy = user ? user.id : this.client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            this.client.emit("messageDeleteBulk", messages);
            for (const msg of messages) msg.channel.messages.delete(msg.id);
            message.channel.bulkDelete(messages)
                .then(() => {
                    message.channel.send(`**${amount}** messages were purged.`)
                        .then(reply => reply.delete(5000)
                        .catch(O_o => {}))
                        .catch(err => {
                            this.client.logger.error(err.stack);
                            return this.client.embed("", message);
                        });
                })
                .catch(err => {
                    if (err.message === "You can only bulk delete messages that are under 14 days old.") return message.channel.send(error.message);
                    this.client.logger.error(err.stack);
                    return this.client.embed("", message);
                });
        } else {
            this.client.emit("messageDeleteBulk", messages);
            for (const msg of messages.values()) msg.channel.messages.delete(msg.id);          
            message.channel.bulkDelete(messages)
                .then(() => {
                    message.channel.send(`**${amount}** messages were purged.`)
                        .then(reply => reply.delete(5000)
                        .catch(O_o => {}))
                        .catch(err => {
                            this.client.logger.error(err.stack);
                            return this.client.embed("", message);
                        });
                })
                .catch(err => {
                    if (err.message === "You can only bulk delete messages that are under 14 days old.") return message.channel.send(error.message);
                    this.client.logger.error(err.stack);
                    return this.client.embed("", message);
                });
        }
    }
}

module.exports = Purge;