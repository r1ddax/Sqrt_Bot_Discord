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
let music;
let status = "disconnected";
let song_list = [];
let nextOne;

client.on('message', async msg => {
	// Join the same voice channel of the author of the message
  if (msg.content === prefix + "join") {
    if (msg.member.voice.channel) {
      msg.reply("I'm joining the voice channel ..");
      const connection = await msg.member.voice.channel.join();
      status = "connected";
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
        status = "disconnected"
      }else{
        msg.reply("I'm not on this channel");
      }
    }else{
      msg.reply("You need to join on channels");
    }
}

  // Playing song
  if (status === "connected" || status === "nomusic" || status === "waiting_song")
  {
    if ((msg.content.startsWith(prefix + 'add'))) {
      if (song_list.length === 0) { status = "connected" };

      let _msg = msg.content + '';
      let splitedUrl = '';

      // Youtube mode 1 and mode 2
      if ((_msg.indexOf('?v=') > -1)) { 
          splitedUrl = _msg.split('?v=');
          msg.reply("Song added to playlist !");
      }else if ((_msg.indexOf('youtu.be/') > -1)) {
          splitedUrl = _msg.split('youtu.be/');
          msg.reply("Song added to playlist !");
      }else{
          msg.reply("Please try to use a youtube url, example: www.youtube.com/watch?v=bcQwIxRcaYs");
          return;
      }
      splitedUrl.shift();
      song_list.push(splitedUrl[0]);
      
    }
  }

  if ((status === "nomusic" || status === "waiting_song") && song_list.length === 0)
  {
    if (((msg.content === prefix + 'play') && song_list.length === 0)) {
      status = "waiting_song";
    }

    if (status === "waiting_song"){
    status = "nomusic";
    console.log(song_list);
    
      setTimeout(function(){
        msg.reply(`Do not have any songs, try ${prefix}add youtube_url`);
      }, 1000);
    }
  }

  // Play first song
  if (status === "connected" || status === "play_next") {
    const connection = await msg.member.voice.channel.join();
    music = connection.play(ytdl('' + song_list[0], { filter: 'audioonly' }));

    if ( (((msg.content === prefix + 'play')) && song_list.length > 0)){
      music = connection.play(ytdl('https://www.youtube.com/watch?v=' + song_list[0], { filter: 'audioonly' }));
      msg.reply(`Playing music now! 🎵`);
      nextOne = false;
      status = "connected";
    }

    music.on('finish', () => { // 'Finished playing!'
      console.log('Song finished');
      status = "play_next";
      console.log(status);
    
      if (status == "play_next") {
        song_list.shift();
        if (song_list.length === 0) {
          console.log('finished songs, waiting');
          msg.reply('Finished songs');
          status = "waiting_song";
        }else{
          console.log('next song');
          msg.reply('Next song');
          nextOne = true;
          status = "connected";
        }
      }
    
    });
  
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