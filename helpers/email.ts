import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // secure: false, // true for 465, false for other ports
    // auth: {
    //   user: process.env.SMTP_USER , // generated ethereal user
    //   pass: process.env.SMTP_PASSWORD // generated ethereal password
    // }
  })
  
const sendMail = async(mail:string, url:string) => {
  // const parsedTemplate = this.parseEmailTemplate(mailData.template)
  try {
    const message = {
      from: `${process.env.SMTP_FROM} <support@talos.africa>`,
      to: mail,
      subject: 'Main Character',
      html: `continue sign in with the provide url ${url}`
    }
    const info = await transporter.sendMail(message)
    return info
    
  } catch (error:any) {
    throw new Error(error.message)
  }
  
}
export default sendMail;