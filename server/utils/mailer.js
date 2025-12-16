import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL
const pass = process.env.PASS

async function mail(to,subject,text){
    try {
        const userDetails = mailer.createTransport({
            service:"gmail",
            auth:{
                user,
                pass
            }
        })
        const sender = await userDetails.sendMail({
            from:user,
            to:[to],
            subject,
            text
        })
    console.log("Email sent successfully",sender.messageId);
    } catch (error) {
        console.log(error);
    }
}

export default mail