import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'coursethunkable@gmail.com', 
      pass: 'tnpq dwnw zeeb zdne' 
    }
});




// let mailOptions = {
//     from: 'BEMO is the sender <coursethunkable@gmail.com>', 
//     to: receiver,
//     subject: "Confirm your email",
//     text: "Hi there", 
//     html: "<b>Hello world</b>"
//   };


//   transporter.sendMail(mailOptions,(error,info)=>{
//     if (error) {
//         return console.log(error);
//       }
//       console.log('Message sent: %s', info.messageId);
//       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   });

async function main(receiver,id) {

    const info = await transporter.sendMail({
    from: 'BEMO is the sender <coursethunkable@gmail.com>', 
    to: receiver,
    subject: "Confirm your email",
    text: "Hi there", 
    html: `<h1> welcome in our application "node Project"</h1>
    <br>
    <br>
    <p> please click below to confirm your email </p>
    <a href='http://localhost:3000/users/confirm/${id}'> here </a>
    `, 
  });

  /*
   <h1>Email Confirmation</h1>
            <form action="http://localhost:3000/users/confirm" method="POST">
                <input type="hidden" name="id" value="${id}" />
                <button type="submit">Confirm Email</button>
            </form>
 */

  console.log("Message sent: %s", info.messageId);
}

export default main