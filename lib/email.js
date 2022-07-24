const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = class Email{
    constructor(user, addr, url){
        this.user_name = `${user.first} ${user.last}`
        this.to = addr
        this.url = url
        this.fromEmail = 'support@pollyapp.io'
        this.fromName = 'PollyApp.io'
    }

    async sendResetEmail(pin) {
        const mailOptions = {
            to: this.to,
            from: {
                email: this.fromEmail,
                name: this.fromName,
            },
            templateId: 'd-e1bb375c375d4be691ed5e4a6a7ecc72',
            dynamic_template_data: {
                action_url: this.url,
                name: this.user_name,
                support_url: 'https://www.pollyapp.io/contact',
                pin: pin,
            }
        }

        try{
            await sgMail.send(mailOptions)
            return true
        }catch(err){
            console.log('> email.js:',err)
            return false
        }
    }
}