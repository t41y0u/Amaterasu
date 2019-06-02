const Command = require("../../util/Command.js");

class Note extends Command {
    constructor (client) {
        super(client, {
            name: "note",
            description: "Generates a note.",
            category: "Misc",
            usage: "note [clear|add <text>|remove <id>|view <id>]",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            let msg;
            switch (args[0]) {
                case "add":
                    msg = await message.channel.send("Creating note...");
                    await this.client.notes.set(message.author.id + message.id, {txt: args.slice(1).join(" "), id: message.author.id + message.id, author: message.author.id});
                    msg.edit("Note created with the ID of " + "**" + message.author.id + message.id + "**.");
                    break;
            case "remove":
                if (this.client.notes.has(args[1])) {
                    if (this.client.notes.get(args[1]).author !== message.author.id) {
                        message.reply("You don't own this note!");
                    } else {
                        msg = await message.channel.send("Deleting note...");
                        await this.client.notes.delete(args[1]);
                        msg.edit("Note deleted with the ID of " + args[1]);
                    }
                } else {
                    message.reply("that is not a valid NoteID!");
                }
                break;
            case "clear":
                await this.client.notes.forEach((note)  => {
                    if (note.author == message.author.id) {
                        this.client.notes.delete(note.id);
                    }
                });
                message.channel.send("Cleared your notes!");
                break;
            case "view":
                if (this.client.notes.has(args[1])) {
                    if (this.client.notes.get(args[1]).author !== message.author.id) {
                        message.reply("you don't own this note!");
                    } else {
                        message.channel.send("❯ " + "**" + this.client.notes.get(args[1]).id + "** : " + this.client.notes.get(args[1]).txt + "\n");
                    }
                } else {
                    message.reply("that is not a valid NoteID!");
                }
                break;
            default:
                let output = "";
                await this.client.notes.forEach((note)  => {
                    if (note.author == message.author.id) {
                        output += "❯ " + "**" + note.id + "** : " + note.txt + "\n";
                    }
                });
                if (output == "") {
                    message.reply("There are no notes!");
                } else {
                    message.channel.send(output);
                }
                break;
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Note;