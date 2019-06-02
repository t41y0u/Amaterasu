const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Emoji extends Command {
    constructor (client) {
        super(client, {
            name: "emoji",
            description: "Returns a random emoji.",
            category: "Fun",
            usage: "emoji",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            const emojis = ['( ͡° ͜ʖ ͡°)', '¯\\_(ツ)_/¯', 'ʕ•ᴥ•ʔ', '(▀̿Ĺ̯▀̿ ̿)', '(ง ͠° ͟ل͜ ͡°)ง', 'ಠ_ಠ', "̿'̿'\\̵͇̿̿\\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿", '[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]', "﴾͡๏̯͡๏﴿ O'RLY?", '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]', '(ᵔᴥᵔ)', '(¬‿¬)', '(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)', '(づ￣ ³￣)づ', 'ლ(ಠ益ಠლ)', 'ಠ╭╮ಠ', '♪~ ᕕ(ᐛ)ᕗ', 'ヾ(⌐■_■)ノ♪', '◉_◉', '\\ (•◡•) /', '༼ʘ̚ل͜ʘ̚༽', '┬┴┬┴┤(･_├┬┴┬┴', 'ᕦ(ò_óˇ)ᕤ', '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻', '（╯°□°）╯︵( .o.)', 'ಠ‿↼', '◔ ⌣ ◔', '(ノಠ益ಠ)ノ彡┻━┻', '(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)', "̿ ̿ ̿'̿'\̵͇̿̿\з=(•_•)=ε/̵͇̿̿/'̿'̿ ̿", '(;´༎ຶД༎ຶ`)', '♥‿♥', 'ᕦ(ò_óˇ)ᕤ', '(•_•) ( •_•)>⌐■-■ (⌐■_■)', '⌐╦╦═─ ಠ_ಠ , (¬‿¬)', '˙ ͜ʟ˙', ":')", '(°ロ°)☝', 'ಠ⌣ಠ', '(；一_一)', '( ⚆ _ ⚆ )', '☜(⌒▽⌒)☞', "(ʘᗩʘ')", '¯\\(°_o)/¯', 'ლ,ᔑ•ﺪ͟͠•ᔐ.ლ', '(ʘ‿ʘ)', 'ಠ~ಠ', 'ಠ_ಥ', 'ಠ‿↼', '(>ლ)', '(ღ˘⌣˘ღ)', 'ಠoಠ', 'ರ_ರ', '◔ ⌣ ◔', '(✿´‿`)', 'ب_ب', '┬─┬﻿ ︵ /(.□. ）', '☼.☼', '^̮^', '(>人<)', '>_>', '(/) (°,,°) (/)', '(･.◤)', '=U', '~(˘▾˘~)', '| (• ◡•)| (❍ᴥ❍ʋ)'];
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle(emojis[Math.floor(Math.random() * (emojis.length))]);
            message.channel.send(embed);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Emoji;
