const twilio = require('twilio');
const { Configuration, OpenAIApi } = require("openai");

const client = twilio(
    TWILIO_ACCOUNT_SID = "AC6010c598cc4223fe1e3504faa156781e",
    TWILIO_AUTH_TOKEN = "dda8283b12f261a0169fd5ba903e3765"
);

let response;

exports.handler = async function (context, event, callback) {
    const twiml = new Twilio.twiml.MessagingResponse();
    const inbMsg = event.Body.toLowerCase().trim();
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });

    const openai = new OpenAIApi(configuration);

    response = await openai.createImage({
        prompt: "food apple",
        n: 2,
        size: '1024x1024',
        response_format: 'url'
    });

    callback(null, twiml);
};

client.messages.create({
    from: "whatsapp:+14155238886",
    to: "whatsapp:+60196399560",
    body: "Here's your image! food",
    mediaUrl: response.data.data[0].url
})
    .then(message => {
        console.log(message.sid);
    })
    .catch(err => {
        console.error(err);
    });
