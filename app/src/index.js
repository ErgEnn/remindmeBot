const login = require("facebook-chat-api");
const fs = require('fs');
const chrono = require('chrono-node');
const Agenda = require('agenda');
const agenda = new Agenda();
const dbUrl = process.env.dbUrl ? process.env.dbUrl: 'localhost:27017/remindmebot';
agenda.database(dbUrl, 'agendaJobs').processEvery('1 minute');

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) {
        console.error(err)
        return;
    }
    api.setOptions({listenEvents: true, selfListen: true})
    
    agenda.define('remind', job =>{
        console.log('running job')
        console.log(job.attrs.data)
        api.sendMessage(".", job.attrs.data.threadID, (err)=> {if(err)console.error(err)}, job.attrs.data.messageID)
    });

    (async function() { 
        await agenda.start(); 
    })();

    api.listenMqtt(async (err, message) => {
        if(err) return console.error(err);
        if(message.type==='presence')
            return;
        console.log(message)
        if(message.type==='message_reply' && message.body.startsWith('/remindme ')){
            let remindDate = chrono.parse(message.body.substring(10), new Date(), {forwardDate:true});
            console.log(remindDate);
            if(remindDate && remindDate[0]){
                var date = remindDate[0].start.date();
                await agenda.schedule(date, 'remind', {messageID: message.messageID, threadID: message.threadID, date: date})
                api.setMessageReaction('\uD83D\uDC4D', message.messageID, (err)=> {if(err)console.error(err)})
                console.log(date)
            }else{
                api.setMessageReaction('\uD83D\uDC4E', message.messageID, (err)=> {if(err)console.error(err)})
            }
        }
            
    });
});