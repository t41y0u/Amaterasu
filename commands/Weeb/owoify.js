const Command = require("../../util/Command.js");

class OwOify extends Command {
    constructor (client) {
        super(client, {
            name: "owoify",
            description: "OwOifies the requested text.",
            category: "Weeb",
            usage: "owoify <text>",
            guildOnly: true,
            aliases: ["owo, uwu, uwuify"]
        });
    }

    async run (message, args, level) {
        try {
            const faces = ['(*^ω^)', '(◕‿◕✿)', '(◕ᴥ◕)', 'ʕ•ᴥ•ʔ', 'ʕ￫ᴥ￩ʔ', '(*^.^*)', 'owo', '(｡♥‿♥｡)', 'uwu', '(*￣з￣)', '>w<', '^w^', '(つ✧ω✧)つ', '(/ =ω=)/'];
            const owoify = (text) => {
                text = text.replace(/(tseries|t-series)/, 't-gay');
                text = text.replace(/(?:l|r)/g, 'w');
                text = text.replace(/(?:L|R)/g, 'W');
                text = text.replace(/n([aeiou])/g, 'ny$1');
                text = text.replace(/N([aeiou])/g, 'Ny$1');
                text = text.replace(/N([AEIOU])/g, 'NY$1');
                text = text.replace(/ove/g, 'uv');
                text = text.replace(/!+/g, ` ${faces[Math.floor(Math.random() * faces.length)]} `);
                return text;
            };
            if (!args[0]) {
                return this.client.embed("commonError", message, "Please provide a message to OwOify!");
            }
            message.channel.send(owoify(args.join(' ')));
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = OwOify;