const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class ChangeMyMind extends Command {
    constructor(client) {
        super(client, {
            name: "changemymind",
            description: "Change my mind...",
            category: "Image",
            usage: "changemymind <text>",
            aliases: ["change-my-mind", "change"]
        });
    }

    async run(message, args, level) {
        let text = args.join(" ");
        if (!text) return this.client.embed("commonError", message, "Please provide some text for me to work on."); 
        else text = encodeURIComponent(args.join(" "));
        message.channel.startTyping();
        fetch(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`)
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.message }))
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = ChangeMyMind;
