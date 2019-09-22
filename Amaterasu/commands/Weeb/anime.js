const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const Jikan = require("jikan-node");
const mal = new Jikan();

class Anime extends Command {
    constructor (client) {
        super(client, {
            name: "anime",
            description: "Returns information about requested anime from MAL.",
            category: "Weeb",
            usage: "anime <name>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            const search = args.join(" ");
            if (!search) return this.client.embed("commonError", message, "Please specify an anime to search!");
            function output(a) {
                var s = a[0].name;
                for (var i = 1; i < a.length; i++) {
                    s += ', ' + a[i].name;
                }
                return s;
            }
            function anotheroutput(a) {
                var s = a[0];
                for (var i = 1; i < a.length; i++) {
                    s += ', ' + a[i];
                }
                return s;
            }
            function andanotheroutput(s) {
                let i = s.lastIndexOf(' ', 2047);
                if (i > 2044) {
                    i = s.lastIndexOf(' ', i - 1);
                }
                console.log(i);
                return (s.substring(0, i + 1) + "...");
            }
            mal.search("anime", search).then(info => {
                const id = info.results[0].mal_id;
                mal.findAnime(id).then(result => {
                    if (result.length === 0) {
                        return message.channel.send(`No results found for **${search}**!`);
                    }
                    const anime = result;
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setAuthor(`${anime.title}`, anime.image_url.replace(/<[^>]*>/g, ''))
                        .setTitle(`External link: https://myanimelist.net/anime/${id}`)
                        .setImage(anime.image_url.replace(/<[^>]*>/g, ''))
                        .setDescription(anime.synopsis ? (anime.synopsis.length <= 2048 ? anime.synopsis.replace(/<[^>]*>/g, '') : andanotheroutput(anime.synopsis.replace(/<[^>]*>/g, ''))) : '`N/A`')
                        .addField('❯ Alternative Titles', `• **English:** ${anime.title_english ? anime.title_english : anime.title}\n• **Synonyms:** ${anime.title_synonyms[0] ? anotheroutput(anime.title_synonyms) : '`N/A`'}\n• **Japanese:** ${anime.title_japanese}`)
                        .addField('❯ Information', `• **Type:** ${anime.type ? anime.type : '`N/A`'}\n• **Episodes:** ${anime.episodes ? anime.episodes : '`N/A`'}\n• **Status:** ${anime.status}\n• **Aired:** ${anime.aired.string}\n• **Premiered:** ${anime.premiered ? anime.premiered : '`N/A`'}\n• **Broadcast:** ${anime.broadcast}\n• **Duration:** ${anime.duration ? anime.duration : '`N/A`'}\n• **Rating:** ${anime.rating ? anime.rating : '`N/A`'}`)
                        .addField('❯ Credits', `• **Producers:** ${anime.producers[0] ? output(anime.producers) : '`N/A`'}\n• **Licensors:** ${anime.licensors[0] ? output(anime.licensors) : '`N/A`'}\n• **Studios:** ${anime.studios[0] ? output(anime.studios) : '`N/A`'}\n• **Source:** ${anime.source}\n• **Genres:** ${anime.genres[0] ? output(anime.genres) : '`N/A`'}`)
                        .addField('❯ Statistics', `• **Score:** ${anime.score ? anime.score : '`N/A`'}\n• **Ranked:** #${anime.rank ? anime.rank : '`N/A`'}\n• **Popularity:** #${anime.popularity ? anime.popularity : '`N/A`'}\n• **Members:** ${anime.members ? anime.members : '`N/A`'}\n• **Favorites:** ${anime.favorites ? anime.favorites : '`N/A`'}`)
                    return message.channel.send({embed});
                }).catch(err => {
                    this.client.logger.error(err.stack);
                    return this.client.embed("APIError", message);
                });
            }).catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Anime;
