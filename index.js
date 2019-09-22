if (Number(process.version.slice(1).split(".")[0]) < 8) {
    throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");
}

require("dotenv").config();

const { Client, Collection } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const Sequelize = require("sequelize");
const klaw = require("klaw");
const path = require("path");
const NekosLifeAPI = require("nekos.life");
const LolisLifeAPI = require("lolis.life");

require("https").createServer().listen(process.env.PORT || 8080);

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    operatorsAliases: false,
    storage: "database.sqlite",
});

const Handle = sequelize.define("users", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
    },
    handle: Sequelize.STRING,
});

class Amaterasu extends Client {
    constructor (options) {
        super(options);
        this.config = require("./config.js");
        this.commands = new Collection();
        this.aliases = new Collection();
        this.playlists = new Collection();
        this.handle = Handle;
        this.settings = new Enmap({ name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true });
        this.embed = require("./util/Embeds");
        this.logger = require("./util/Logger");
        this.wait = require("util").promisify(setTimeout);
        this.notes = new Enmap({name: "notes"});
        this.nekoslife = new NekosLifeAPI();
        this.lolislife = new LolisLifeAPI();
    }
    permlevel (message) {
        let permlvl = 0;
        const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) {
                continue;
            }
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    }
    loadCommand (commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading Command: ${props.help.name}. 👌`, "log");
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }
    async unloadCommand (commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) {
            return `The command \`${commandName}\` doesn\"t seem to exist, nor is it an alias. Try again!`;
        }
        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }
    getSettings (guild) {
        const defaults = this.config.defaultSettings || {};
        const guildData = this.settings.get(guild.id) || {};
        const returnObject = {};
        Object.keys(defaults).forEach((key) => {
            returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
        });
        return returnObject;
    }
    writeSettings (id, newSettings) {
        const defaults = this.settings.get("default");
        let settings = this.settings.get(id);
        if (typeof settings != "object") settings = {};
        for (const key in newSettings) {
            if (defaults[key] !== newSettings[key]) {
                settings[key] = newSettings[key];
            } else {
                delete settings[key];
            }
        }
        this.settings.set(id, settings);
    }
    async awaitReply (msg, question, limit = 60000) {
        const filter = m=>m.author.id = msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    }
}

const client = new Amaterasu();
console.log(client.config.permLevels.map(p => `${p.level} : ${p.name}`));

const init = async () => {
    klaw("./commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") {
            return;
        }
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) {
            client.logger.error(response);
        }
    });
    const evtFiles = await readdir("./events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    client.login(process.env.DISCORD_TOKEN);
};

init();

client.once("ready", () => client.handle.sync())

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
      .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
      .on("error", err => client.logger.error(err))
      .on("warn", info => client.logger.warn(info))

String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    process.exit(1);
});

process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
});