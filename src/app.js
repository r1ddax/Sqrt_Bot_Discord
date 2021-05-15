'use strict';

// Play 
const ytdl = require('ytdl-core');

// Configure Token and Prefix
const config = require('./resources/config.json');
const token   = config.token;
const prefix  = config.prefix;

// Configure client
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token);

// When discord bot to start:
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  readyMsg("Squirt.. Squirtle! | I'm ready! | Let's Go!", 
                                                  client);

});

// Clear chat
let getIdWhoExecuted;
client.on('message', function(msg) {

  // Clear system
  if (msg.content === prefix + "clear") {
    getIdWhoExecuted = msg.author.id;
    msg.channel.send('I will clean, do not type when I am cleaning.');
    setTimeout(function(){
      msg.channel.send('Clearning');
    }, 3000);
  }

  if (msg.author.bot && msg.content === 'Clearning'){
    msg.channel.bulkDelete(100);
    msg.channel.send(`Clear Done! Squirt..! ~~~ Command used by: <@${getIdWhoExecuted}>`);
  }

});

// Voice Channel
let music; // Song vars

client.on('message', async msg => {
	// Join the same voice channel of the author of the message
  if (msg.content === prefix + "join") {
    if (msg.member.voice.channel) {
      msg.reply("I'm joining the voice channel ..");
      const connection = await msg.member.voice.channel.join();
    }else{
      msg.reply("You need to join voice channel");
    }
}

if (msg.content === prefix + "leave") {
    const voiceChannelM = msg.member.voice.channel;
    const voiceChannelC = msg.guild.voice.channel;

    if (msg.member.voice.channel) {
      if (voiceChannelM == voiceChannelC){
        msg.reply("I'm leaving the voice channel ..");
        const connection = await msg.member.voice.channel.leave();
      }else{
        msg.reply("I'm not on this channel");
      }
    }else{
      msg.reply("You need to join on channels");
    }
}

if ((msg.content.startsWith(prefix + 'play'))) {
  let _msg = msg.content + '';
  let splitedUrl = '';

  // Youtube mode 1 and mode 2
  if ((_msg.indexOf('?v=') > -1)) { 
      splitedUrl = _msg.split('?v=');
  }else if ((_msg.indexOf('youtu.be/') > -1)) {
      splitedUrl = _msg.split('youtu.be/');      
  }else{
      msg.reply("Please try to use a youtube url, example: www.youtube.com/watch?v=bcQwIxRcaYs");
      return;
  }

  msg.reply(`Playing music now! 🎵`);
  const connection = await msg.member.voice.channel.join();
  music = connection.play(ytdl('https://www.youtube.com/watch?v=' + splitedUrl[1], { filter: 'audioonly' }));
  // music.setVolume(0.5);
}

if (msg.content == (prefix + 'stop')) {
  // if(!client.music.isPlaying()) {
  //   msg.reply('Do not have any song playing now');
  // }else{
    music.pause();
  // }
}

});

// Functions
function readyMsg(readyText, client) {
  let splitedReadyText = readyText.split(' | ');

  client.channels.fetch('842913438169956354').then(channel => {
    channel.send(splitedReadyText[getRandomInt(0,splitedReadyText.length-1)]);
  })

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}