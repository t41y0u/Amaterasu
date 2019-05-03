const Command = require("../base/Command.js");

class STVolume extends Command {
    constructor (client) {
        super(client, {
            name: "stvolume",
            description: "Changes the radio volume output of the bot.",
            category: "Music",
            usage: "stvolume",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let vol = args;
        const voiceConnection = this.client.voiceConnections.find(val => val.channel.guild.id == message.guild.id);
        if (voiceConnection === null) {
            return message.channel.send(":no_entry_sign: | No music is being played!");
        }
        const dispatcher = voiceConnection.player.dispatcher;
        const currentvol = dispatcher.volume * 100;
        if (!vol) {
            return message.channel.send(":no_entry_sign: | No music is being played!");
        }
        if (vol > 200 || vol < 0) {
            return message.channel.send(":no_entry_sign: | Volume out of range!")
        }
        dispatcher.setVolume((vol / 100));
        message.channel.send(`:musical_note: | Volume changed to ${vol}%.`);
    }
}

module.exports = STVolume;