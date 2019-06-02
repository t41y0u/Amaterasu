const Command = require("../../util/Command.js");

class STVolume extends Command {
    constructor (client) {
        super(client, {
            name: "stvolume",
            description: "Changes the radio volume output of the bot or displays current volume",
            category: "Music",
            usage: "stvolume",
            guildOnly: true,
            aliases: ["rvolume"]
        });
    }

    async run (message, args, level) {
        try {
            let vol = args;
            const voiceConnection = this.client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
            if (voiceConnection === null) {
                return this.client.embed("emptyQueue", message);
            }
            const dispatcher = voiceConnection.player.dispatcher;
            const currentvol = dispatcher.volume * 100;
            if (!currentvol) {
                return this.client.embed("emptyQueue", message);
            }
            if (!vol) {
                return this.client.embed("currentVolume", message);
            }
            if (vol < 0 || vol > 100 || isNaN(vol)) {
                return this.client.embed("errorVolume", message);
            }
            dispatcher.setVolume((vol / 100));
            return this.client.embed("volumeSet", message, vol);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = STVolume;