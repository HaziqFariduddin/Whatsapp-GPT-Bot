const { Configuration, OpenAIApi } = require("openai");
const Twilio = require('twilio');

exports.handler = async function (context, event, callback,) {
    const twiml = new Twilio.twiml.MessagingResponse();
    const inbMsg = event.Body.toLowerCase().trim();
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });

    const test = twiml.message()
    const openai = new OpenAIApi(configuration);

    if (inbMsg.startsWith("image") || inbMsg.startsWith("draw") || inbMsg.startsWith("sketch") || inbMsg.startsWith("doodle") || inbMsg.startsWith("paint") || inbMsg.startsWith("design") || inbMsg.startsWith("illustrate") || inbMsg.startsWith("illustration") || inbMsg.startsWith("drawing") || inbMsg.startsWith("painting") || inbMsg.startsWith("sketching")) {
        try {
            const stablediffusion = await import('image-generator-client');
            const urls = await stablediffusion.default(inbMsg, {
                width: 1024,
            });
            if (urls && urls.length > 0) {
                const imageUrl = urls[0];
                const message = "Here is the image that match your prompt";
                test.body(message);
                test.media(imageUrl)
                return callback(null, twiml);
            } else {
                test.body("Sorry, I couldn't generate any images for your prompt :(");
                return callback(null, twiml);
            }
        } catch (err) {
            console.log(err)
            return callback(err, twiml);
        }
    }

    else {
        try {
            const text_response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Your Name: Miwa GPT, a female AI assistant. Developed by: Farid (wa.me/+60196399560). Can do: all sort of things like translating, generating images, writing, providing answers, Internet access & many more. Always end replies with any cute emoji" },
                    { role: "user", content: inbMsg }
                ],
                temperature: 0.6, //A number between 0 and 1 that determines how many creative risks the engine takes when generating text.
                max_tokens: 4000, // Maximum completion length. max: 4000-prompt
                frequency_penalty: 0.5 // # between 0 and 1. The higher this value, the bigger the effort the model will make in not repeating itself.
            });
            const response = text_response.data.choices[0].message.content
            test.body(response)
            return callback(null, twiml);
        } catch (err) {
            test.body("Sorry, I couldn't process your prompt at this time :(");
            console.log(err)
            return callback(err, twiml);

        }
    }
}