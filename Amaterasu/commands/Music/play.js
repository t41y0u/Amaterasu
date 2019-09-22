const Command = require("../../util/Command.js");
const handleVideo = require("../../util/MusicHandling.js");
const { RichEmbed, Util } = require("discord.js");
const ytapi = require("simple-youtube-api"); 
const youtube = new ytapi(process.env.GOOGLE_API_KEY); 

class Play extends Command {
    constructor (client) {
        super(client, {
            name: "play",
            description: "Queue a song/playlist by URL or name.",
            category: "Music",
            usage: "play <song|url|id>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            if (!args.length) return this.client.embed("noArgs", message);
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
            const permissions = voiceChannel.permissionsFor(this.client.user).toArray();
            if (!permissions.includes("CONNECT")) return this.client.embed("noPerms-CONNECT", message);
            if (!permissions.includes("SPEAK")) return this.client.embed("noPerms-SPEAK", message);
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                const playlist = await youtube.getPlaylist(url);
                const videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    const video2 = await youtube.getVideoByID(video.id);
                    await handleVideo(video2, message, voiceChannel, true);
                }
                const embed = new RichEmbed()
                    .setAuthor("✅ Playlist added!")
                    .setDescription(`Playlist: **${Util.escapeMarkdown(playlist.title)}** has been added to the queue!`)
                    .setColor(0x00FFFF);
                message.channel.send(embed);
            } else {
                let video;
                try {
                    video = await youtube.getVideo(url);
                } catch (error) {
                    const videos = await youtube.searchVideos(args.join(" "), 1);
                    if (!videos.length) return this.client.embed("noSongsFound", message, args);
                    video = await youtube.getVideoByID(videos[0].id);   
                }
                return handleVideo(video, message, voiceChannel);
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Play;