const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Robot extends Command {
    constructor(client) {
        super(client, {
            name: "robot",
            description: "Generates a picture of a robot from some given text.",
            category: "Image",
            usage: "robot <text>",
            aliases: ["robohash"]
        });
    }

    async run(message, args, level, settings, texts) {
        const query = args.join(" ");
        if (!query) return this.client.embed("commonError", message, "Please provide some text for me to generate the robot.");
        if (query.match(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/g)) return this.client.embed("commonError", message, "Your query cannot include symbols.");
        message.channel.startTyping();
        fetch(`https://robohash.org/${encodeURIComponent(query)}.png`)
            .then(res => message.channel.send({ files: [{ attachment: res.body, name: `${query}.png` }] })
            .catch(error => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            }));
        message.channel.stopTyping(true);
    }
}

module.exports = Robot;
