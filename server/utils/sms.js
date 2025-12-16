import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const sid = process.env.ACCOUNTSID 
const token = process.env.TOKEN 
const from = process.env.PHONE

async function sendSms(to,body){
    try {
        const client = twilio(sid,token)
        const sender = await client.messages.create({
            from,
            to,
            body
        })
        console.log("Sms sent successfully!",sender.sid);
    } catch (error) {
        console.log(error);
    }
}

export default sendSms