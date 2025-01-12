const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
    to: 'broseph500@gmail.com', // Change to your recipient
    from: 'j.newm500@gmail.com', // Change to your verified sender
    subject: 'Saying Hello',
    text: 'hello this is Joseph Newman',
    html: '<strong>hello this is Joseph Newman</strong>',
}
sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
