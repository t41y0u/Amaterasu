const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const checkImage = require("is-image-url");
const Sagiri = require("sagiri");
const saucenao = new Sagiri(process.env.SAUCENAO_TOKEN, {"getRating": true });

class Sauce extends Command {
    constructor (client) {
        super(client, {
            name: "sauce",
            description: "Get the cource of an image from its URL.",
            category: "Weeb",
            usage: "sauce <image url>",
            guildOnly: true,
            aliases: ["source"]
        });
    }

    async run (message, args, level) {
        try {
            let embed = new RichEmbed().setColor(0x00FFFF);
            if (!message.channel.nsfw) {
                embed.setTitle("🔞 NSFW").setDescription("This command may contain some NSFW content so make sure you use this in a NSFW channel.");
                return message.channel.send({embed});
            }
            if (!checkImage(args[0])) return this.client.embed("commonError", message, "The URL you specified is not an image. Please check your URL.");
            const results = await saucenao.getSauce(args[0]);
            if (!results[0]) {
                embed.setTitle("❌ Error").setDescription("No search results found for your query.");
                return message.channel.send({embed});
            }
            let idx = 0, author = message.author;
            embed.setTitle(results[idx].original.data.title || `Image from ${results[idx].site}`)
                 .setURL(results[idx].url)
                 .setThumbnail(results[idx].thumbnail)
                 .addField("Similarity", `${results[idx].similarity.toString()}%`)
                 .addField("Artist", results[idx].original.data.creator || `${results[idx].original.data.member_name} (${results[idx].original.data.member_id})`)
            const msg = await message.channel.send({embed});
            msg.react("⬅").then(() => msg.react("🗑")).then(() => msg.react("➡"));
            const collector = msg.createReactionCollector((reaction, user) => ["⬅", "🗑", "➡"].includes(reaction.emoji.name) && user === author);
            collector.on('collect', async (reaction) => {
                if (reaction.emoji.name === "⬅") {
                    idx--;
                } else if (reaction.emoji.name === "▶") {
                    return msg.delete();
                } else if (reaction.emoji.name === "➡") {
                    idx++;
                }
                if (idx < 0 || idx > results.length - 1) {
                    if (reaction.emoji.name === "⬅") {
                        idx++;
                    } else if (reaction.emoji.name === "➡") {
                        idx--;
                    }
                } else {
                    embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(results[idx].original.data.title || `Image from ${results[idx].site}`)
                        .setURL(results[idx].url)
                        .setThumbnail(results[idx].thumbnail)
                        .addField("Similarity", `${results[idx].similarity.toString()}%`)
                        .addField("Artist", results[idx].original.data.creator || `${results[idx].original.data.member_name} (${results[idx].original.data.member_id})`)
                    msg.edit({embed});
                }
                await reaction.remove(reaction.users.filter(user => user !== this.client.user).first());
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Sauce;