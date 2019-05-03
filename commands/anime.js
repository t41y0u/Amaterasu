const Command = require("../base/Command.js");
const Discord = require("discord.js");
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
        const search = args.join(" ");
        if (!search) {
            return message.reply(`please specify an anime to search!`)
        }
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
                s += ', ' + a[0];
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
                const embed = new Discord.RichEmbed()
                    .setColor(0x00FFFF)
                    .setAuthor(`${anime.title}`, anime.image_url.replace(/<[^>]*>/g, ''))
                    .setTitle(`External link: https://myanimelist.net/anime/${id}`)
                    .setImage(anime.image_url.replace(/<[^>]*>/g, ''))
                    .setDescription(andanotheroutput(anime.synopsis.replace(/<[^>]*>/g, '')))
                    .addField('❯\u2000\Alternative Titles', `•\u2000\**English:** ${anime.title_english ? anime.title_english : anime.title}\n\•\u2000\**Synonyms:** ${anime.title_synonyms[0] ? anotheroutput(anime.title_synonyms) : '`N/A`'}\n\•\u2000\**Japanese:** ${anime.title_japanese}`)
                    .addField('❯\u2000\Information', `•\u2000\**Type:** ${anime.type ? anime.type : '`N/A`'}\n\•\u2000\**Episodes:** ${anime.episodes ? anime.episodes : '`N/A`'}\n\•\u2000\**Status:** ${anime.status}\n\•\u2000\**Aired:** ${anime.aired.string}\n\•\u2000\**Premiered:** ${anime.premiered ? anime.premiered : '`N/A`'}\n\•\u2000\**Broadcast:** ${anime.broadcast}\n\•\u2000\**Duration:** ${anime.duration ? anime.duration : '`N/A`'}\n\•\u2000\**Rating:** ${anime.rating ? anime.rating : '`N/A`'}`)
                    .addField('❯\u2000\Credits', `•\u2000\**Producers:** ${anime.producers[0] ? output(anime.producers) : '`N/A`'}\n\•\u2000\**Licensors:** ${anime.licensors[0] ? output(anime.licensors) : '`N/A`'}\n\•\u2000\**Studios:** ${anime.studios[0] ? output(anime.studios) : '`N/A`'}\n\•\u2000\**Source:** ${anime.source}\n\•\u2000\**Genres:** ${anime.genres[0] ? output(anime.genres) : '`N/A`'}`)
                    .addField('❯\u2000\Statistics', `•\u2000\**Score:** ${anime.score ? anime.score : '`N/A`'}\n\•\u2000\**Ranked:** #${anime.rank ? anime.rank : '`N/A`'}\n\•\u2000\**Popularity:** #${anime.popularity ? anime.popularity : '`N/A`'}\n\•\u2000\**Members:** ${anime.members ? anime.members : '`N/A`'}\n\•\u2000\**Favorites:** ${anime.favorites ? anime.favorites : '`N/A`'}`)
                return message.channel.send({embed});
            }).catch(err => {
                console.log(err);
                message.reply("there was an error processing your request. Please try again later.");
            });
        }).catch(err => {
            console.log(err);
            message.reply("there was an error processing your request. Please try again later.");
        });
    }
}

module.exports = Anime;
