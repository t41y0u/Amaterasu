const Command = require("../base/Command.js");

class OwOify extends Command {
    constructor (client) {
        super(client, {
            name: "owoify",
            description: "OwOify your message.",
            usage: "owoify <text>",
            guildOnly: true,
            aliases: ["owo, uwu, uwuify"]
        });
    }

    async run (message, args, level) {
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
            message.channel.send('you must provide a message to OwOify!');
        } else {
            message.channel.send(owoify(args.join(' ')));
        }
    }
}

module.exports = OwOify;