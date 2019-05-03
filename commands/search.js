const Command = require("../base/Command.js");
const { RichEmbed, Util } = require("discord.js");
const he = require("he");
const ytapi = require("simple-youtube-api"); 
const { YT_KEY } = require("../.env");
const youtube = new ytapi(YT_KEY); 
const handleVideo = require("../util/MusicHandling");

const idx = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

class Search extends Command {
    constructor (client) {
        super(client, {
            name: "search",
            description: "Searches for up to 10 videos from YouTube.",
            category: "Music",
            usage: "search <song>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
        const voiceChannel = message.member.voiceChannel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
        if (!args[0]) return this.client.embed("noArgs", message);
        if (!permissions.has("CONNECT")) return this.client.embed("noPerms-CONNECT", message);
        if (!permissions.has("SPEAK")) return this.client.embed("noPerms-SPEAK", message);
        let video;
        try {
            const videos = await youtube.searchVideos(args.join(" "), 10);
            if (!videos.length) return this.client.embed("noSongsFound", message, args);
            let index = 0;
            const embed = new RichEmbed()
                .setAuthor("🔍 Song Selection")
                .setDescription(`${videos.map(video2 => `**${idx[index++]} -** ${he.decode(video2.title)}`).join("\n")}`)
                .setFooter("Please provide a value to select one of the search results ranging from 0️⃣-9️⃣.")
                .setColor(0x00FFFF);
            message.channel.send(embed);
            const response = await message.channel.awaitMessages(msg2 => (msg2.content > -1 && msg2.content < 10) && msg2.author.id === message.author.id, {
                max: 1,
                time: 10000,
                errors: ["time"]
            });
            if (!response) return this.client.embed("invalidEntry", message);
            const videoIndex = parseInt(response.first().content);
            video = await youtube.getVideoByID(videos[videoIndex].id);
        } catch (err) {
            console.log(err);
            return this.client.embed("noSearchResults", message);
        }
        return handleVideo(video, message, voiceChannel);
    }
}

module.exports = Search;