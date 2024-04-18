import compile from "mjml";
import nodemailer from 'nodemailer'
import { configDotenv } from 'dotenv';
configDotenv({ path: '.env' })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

export default function SendMail(data, files) {
    let attachments = []
    files.forEach(file => {
        attachments.push({ filename: file.originalname, path: file.path })
    });
    const html = compileMjl(data)
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: process.env.MAIL_TO_ADDRESS,
        subject: 'Contact Avinato',
        html: html,
        attachments: attachments
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
            console.log('E-mail envoyé :', info.response);
        }
    });
}

function compileMjl(data) {

    const mjml = `<mjml>
    <mj-head>
      <mj-style>
        .container {
          margin: 0 auto;
          font-family: Arial, sans-serif;
          color: #f2f2f2;
        }
        .header {
          background-color: #f2f2f2;
          padding: 20px;
          text-align: center;
        }
        .title {
            color: #555555;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            margin-bottom: 10px
        }
        .content {
          padding: 20px;
          background-color: #dddddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .MessageContent {
            padding: 20px;
            background-color: #eeeeee;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

        .field {
          margin-bottom: 10px;
          color:#808080;
        }
        .field strong {
          display: inline-block;
          width: 150px;
          color: #555555;
        }
      </mj-style>
    </mj-head>
    <mj-body>
      <mj-section>
        <mj-column class="container">
          <mj-text class="header">
            <p class="title">New contact message</p>
            <p class="field"><strong>Name:</strong> ${data.name}</p>
            <p class="field"><strong>Company name:</strong> ${data.companyName}</p>
            <p class="field"><strong>Company adresse:</strong>${data.companyAdresse}</p>
            <p class="field"><strong>E-mail:</strong> ${data.email}</p>
          </mj-text>
          <mj-divider style:" background-color:#808080; height:1px;"/>
          <mj-text class="MessageContent">
          <p class="field">${data.message}</p>
           </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `
    const html = compile(mjml).html;
    return html
}
