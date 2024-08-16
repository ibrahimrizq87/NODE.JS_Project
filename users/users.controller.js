import connection from '../db/connection.js';
import validation from '../middleWare/validation.js';
import bcrypt from 'bcrypt'
import mailer from '../utilities/sendMail.js'


// --------------------------- optimized code -------------------------------------// 
const signUp = async (req, res, next) => {
    const { userName, email, user_ID, password, repeat_password, age, gender, phone } = req.body;
    try {
        const value = await validation.RegSchema.validateAsync({ userName, email, user_ID, password, repeat_password, age, gender, phone });
        console.log('Valid Data:', value);

    } catch (err) {
        const error = new Error(err)
        error.statusCode = 400;
        return next(error);
    }


    const findQuery = 'SELECT * FROM user WHERE email = ?';
    const insertQuery = 'insert into user (user_ID,user_name,email,password,age,gender,phone) values (?,?,?,?,?,?,?)'

    connection.query(findQuery, [email], (err, data) => {
        if (err) {
            const error = new Error(err)
            error.statusCode = 500;
            return next(error);
        }
        if (data.length > 0) {
            const error = new Error(`Email ${req.body.email} exists`)
            error.statusCode = 500;
            return next(error);
            // return next(new Error(`Email ${req.body.email} exists`));
            // return res.json({ message: `Email ${req.body.email} exists` })

        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    const error = new Error(err)
                    error.statusCode = 500;
                    return next(error);
                }
                console.log('Hash:', hash);
                connection.query(insertQuery, [user_ID, userName, email, hash, age, gender, phone], (err, result) => {
                    if (err) {
                        const error = new Error(`Error happened: ${err}`)
                        error.statusCode = 500;
                        return next(error);

                    }
                    mailer(email,user_ID)
                        .then(() => {
                            res.json({ message: 'User registered successfully but need confirmation using email', data: result });
                            console.log('Email sent successfully')
                        })
                        .catch(error => console.error('Error sending email:', error));
                });
            });

        }

    });

}


const confirmUser = async (req, res, next) => {
      const id = req.params.id;
      const findQuery = 'SELECT * FROM user WHERE user_ID = ?';

      const updateQuery = ` UPDATE user
      SET hasPermission = ? WHERE user_ID = ?
`;

      connection.query(findQuery, [id ], (err, data) => {

        if (err) return res.json({ message: `Error happend: ${err}` })
        
            if (data.length > 0) {
            connection.query(updateQuery, [id, "true"], (err, result) => {
                if (err) {
                    console.error(`Error occurred while deleting user: ${err}`);
                    return res.json({ message: `Error happened: ${err}` });
                }
                console.log({ message: 'User confirmed successfully', data: result });
                // res.json({ message: 'User confirmed successfully', data: result });
                res.send(`
        <html>
        <head>
            <title>Email Confirmed</title>
        </head>
        <body>
            <h1>Email Confirmation Successful</h1>
            <p>Thank you for confirming your email address. Your email has been successfully confirmed.</p>
            <p>You can now enjoy full access to our services.</p>
        </body>
        </html>
    `);
            });
        } else {
            return res.json({ message: `user id: ${req.body.email} dose not exist` })


        }

    });


}



const logIn = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const value = await validation.logSchema.validateAsync({ email, password });
        console.log('Valid Data:', value);

    } catch (err) {
        const error = new Error(err)
        error.statusCode = 400;
        return next(error);
    }

    const findQuery = 'SELECT * FROM user WHERE email = ?';

    connection.query(findQuery, [email], (err, data) => {
        if (err) return res.json({ message: `Error happend: ${err}` })
        if (data.length > 0) {

            console.log(data[0].password);
            bcrypt.compare(password, data[0].password, function (err, result) {
                if (err) {
                    const error = new Error(err)
                    error.statusCode = 500;
                    return next(error);
                }

                console.log('Comparison result:', result);
                if (!result) {
                    return res.json({ message: `incorrect Password` })
                } else {
                    return res.json({ message: `logged in successfully :) ` })
                }
            });




        } else {
            return res.json({ message: `Email ${req.body.email} does not exist` })

        }
    });
}


// --------------------------- optimized code -------------------------------------// 


const updateUser = (req, res) => {


    const id = req.params.id;

    let { userName, user_ID, password, age, gender, phone, email } = req.body;
    const findQuery = 'SELECT * FROM user WHERE user_ID = ?';
    const updateQuery = ` UPDATE user
                          SET user_name = ?, email = ?, password = ?, age = ?, gender = ?, phone = ?
                          WHERE user_ID = ?
  `;

    connection.query(findQuery, [id], (err, data) => {

        if (err) return res.json({ message: `Error happend: ${err}` })
        if (data.length > 0) {
            console.log(data)
            console.log(user_ID, userName, email, password, age, gender, phone);
            if (userName == null) userName = data[0].user_name;
            if (user_ID == null) user_ID = data[0].user_ID;
            if (password == null) password = data[0].password;
            if (email == null) email = data[0].email;
            if (age == null) age = data[0].age;
            if (gender == null) gender = data[0].gender;
            if (phone == null) phone = data[0].phone;
            console.log(user_ID, userName, email, password, age, gender, phone);

            connection.query(updateQuery, [userName, email, password, age, gender, phone, id], (err, result) => {
                if (err) {
                    console.error(`Error occurred while updating user: ${err}`);
                    return res.json({ message: `Error happened: ${err}` });
                }
                res.json({ message: 'User updated successfully', data: result });
            });
        } else {
            return res.json({ message: `user id ${id} dose not exist` })


        }

    });



}
const deleteUser = (req, res) => {

    const id = req.params.id;

    const findQuery = 'SELECT * FROM user WHERE user_ID = ?';
    const deleteQuery = 'DELETE FROM user WHERE user_id = ?';


    connection.query(findQuery, [id], (err, data) => {
        if (err) return res.json({ message: `Error happend: ${err}` })
        if (data.length > 0) {
            connection.query(deleteQuery, [id], (err, result) => {
                if (err) {
                    console.error(`Error occurred while deleting user: ${err}`);
                    return res.json({ message: `Error happened: ${err}` });
                }
                res.json({ message: 'User deleted successfully', data: result });
            });
        } else {
            return res.json({ message: `user id: ${req.body.email} dose not exist` })


        }

    });



}
const getUsers = (req, res) => {

    const findQuery = 'SELECT * FROM user';
    connection.query(findQuery, (err, data) => {
        if (err) return res.json({ message: `Error happend: ${err}` })
        res.json(data);
    });
}



const searchUserName = (req, res) => {
    const sql = `SELECT * FROM user WHERE userName LIKE 'A%' AND age < 26`;
    connection.query(sql, (err, result) => {
        if (err) return res.json({ message: `Error happend: ${err}` })

        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "there are now users here like this.." });
        }
    });
};



const getUsersHasAge = (req, res) => {
    const age = req.params.age;

    const findQuery = 'SELECT * FROM user where age = ?';
    connection.query(findQuery, [age], (err, data) => {
        if (err) return res.json({ message: `Error happend: ${err}` })
        if (data.length > 0) {
            return res.json(data);
        } else {
            return res.json({ message: "there are now users with this age here.." });
        }
    });
}




const getUserByPost = (req, res) => {
    const pid = req.params.postID;

    const findQuery = 'SELECT * FROM post where post_ID = ?';
    const findUser = 'SELECT * FROM user where user_ID = ?';
    connection.query(findQuery, [pid], (err, data) => {
        if (err) return res.json({ message: `Error happend: ${err}` })
        if (data.length > 0) {
            connection.query(findUser, [data[0].user_ID], (err, result) => {
                return res.json(result);
            });

        } else {
            return res.json({ message: "there are now posts with this id here.." });
        }
    });
}




export default {
    signUp,
    logIn,
    updateUser,
    deleteUser,
    getUserByPost,
    getUsers,
    getUsersHasAge,
    searchUserName,confirmUser
}



/*

     { "userName": "bemo",
 "email" : "ibrahimrizqabd@gmail.com",
 "user_ID" :"2" , 
"password" : "abCD12", 
"repeat_password": "abCD12" ,
 "age":23,
 "gender":"male", 
"phone":"01148259854" } 

*/