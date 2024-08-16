import connection from '../db/connection.js';


const addPost =(req,res , next)=>{
    const { post_ID, user_ID, title, content} = req.body;
    const findQuery = 'SELECT * FROM user WHERE user_ID = ?';

    const insertQuery = 'insert into post (post_ID,user_ID,title,content) values (?,?,?,?)';
    
    connection.query(findQuery, [user_ID], (err, data) => {
        if (err) 
            {
                const error = new Error(`Error happend: ${err}`);
                    error.statusCose = 500; 
                    return next(error);
            }

        if (data.length > 0) {
            connection.query(insertQuery, [ post_ID, user_ID, title, content], (err, result) => {
                if (err) {
                    // console.error(`Error occurred while inserting post: ${err}`);
                    const error = new Error(err);
                    error.statusCose = 500; 
                    return next(error);
                    // return res.json({ message: `Error happened: ${err}` });
                }
                res.json({ message: 'post added successfully', data: result });
            });
            
        } else {
            const error = new Error(`user id dose not exist`);
                    error.statusCose = 404; 
                    return next(error);
            

           
        }

    });

}
const deletePost =(req,res,next)=>{
    
    const uid =req.params.uid;
    const pid =req.params.pid;
 

    const findQuery = 'SELECT * FROM user WHERE user_ID = ?';
    const findpost = 'SELECT * FROM post WHERE post_ID = ?';
    const deleteQuery = 'DELETE FROM post where post_ID = ?';


    connection.query(findQuery, [uid], (err, data) => {
        // console.log('here')
        if (err)  {
            const error = new Error(`Error happend: ${err}`);
                error.statusCode = 500; 
                return next(error);
        }
        if (data.length > 0) {
            connection.query(findpost, [pid], (err, result) => {
                if (err) {
                    // console.error(`Error occurred while inserting post: ${err}`);
                    const error = new Error(err);
                    error.statusCode = 500; 
                    return next(error);
                    // return res.json({ message: `Error happened: ${err}` });
                }
                if (result.length >0){
                if ( result[0].user_ID == uid){
                    
                    connection.query(deleteQuery, [pid], (err, result) => {
                        if (err){
                            const error = new Error(err);
                            error.statusCode = 500; 
                            return next(error);
                        }  
                        res.json({ message: 'post deleted successfully', data: result });
                    });

                }else {
                    const error = new Error('can not delete this post it is not yours' );
                    error.statusCode = 403;  //Forbidden 
                    return next(error);
                }
            }else{
                
                    const error = new Error(`post id ${uid} dose not exsist` );
                    error.statusCode = 404; 
                    return next(error);
                

            }
            });
            
        } else {
            const error = new Error(`user id ${uid} dose not exsist` );
            error.statusCode = 404; 
            return next(error);
           
        }

    });



}
const updatePost =(req,res,next)=>{

    const {  title, content} = req.body;

    const uid =req.params.uid;
    const pid =req.params.pid;
 

    const findQuery = 'SELECT * FROM user WHERE user_ID = ?';
    const findpost = 'SELECT * FROM post WHERE post_ID = ?';
    const updateQuery = 'UPDATE post SET  title = ?, content = ? WHERE post_ID = ?';


    connection.query(findQuery, [uid], (err, data) => {

        if (err)  {
            const error = new Error(`Error happend: ${err}`);
                error.statusCode = 500; 
                return next(error);
        }
        if (data.length > 0) {
            connection.query(findpost, [pid], (err, result) => {
                if (err) {
                    const error = new Error(err);
                    error.statusCode = 500; 
                    return next(error);
                }
                if (result.length >0){
                if ( result[0].user_ID == uid){
                    
                    if (title == null) title =result[0].title;
                    if(content == null) content = result[0].content;

                    connection.query(updateQuery, [title,content,pid], (err, result) => {
                        if (err) {
                            const error = new Error(err);
                            error.statusCode = 500; 
                            return next(error);
                        }  
                        res.json({ message: 'post update successfully', data: result });
                    });

                }else {
                    const error = new Error('can not update this post it is not yours' );
                    error.statusCode = 403;  //Forbidden 
                    return next(error);

                }
            }else{
                const error = new Error(`post id ${uid} dose not exsist` );
                    error.statusCode = 404; 
                    return next(error);

            }
            });
            
        } else {
            const error = new Error(`user id ${uid} dose not exsist` );
                    error.statusCode = 404; 
                    return next(error);

           
        }

    });




}
const getAllPosts =(req,res,next)=>{
    const findposts = 'SELECT * FOM post';
    connection.query(findposts, (err, data) => {

        if (err) {
            const error = new Error(err);
            error.statusCode = 500; 
            return next(error);
        }  
            res.json(data)
        });

}


const getAllPostsWithOwner = (req,res,next)=>{
    const findposts = 'SELECT * FROM post';
    const findpostsWithOwner = 'SELECT * FROM post JOIN user On post.user_ID= user.user_ID';
    connection.query(findposts, (err, data) => {

        if (err) {
            const error = new Error(err);
            error.statusCode = 500; 
            return next(error);
        }  
            
                connection.query(findpostsWithOwner, (err, data) => {
                    if (err) {
                        const error = new Error(err);
                        error.statusCode = 500; 
                        return next(error);
                    }  
                        res.json(data);
                    });           
        });
}
const getPostesSorted = (req,res,next)=>{
                        
    const findposts = 'SELECT * FROM post ORDER BY date DESC';
    connection.query(findposts, (err, data) => {

        if (err) {
            const error = new Error(err);
            error.statusCode = 500; 
            return next(error);
        }  
            res.json(data)
        });
}

export  default {
    addPost,
    deletePost,
    updatePost,
    getAllPosts,
    getAllPostsWithOwner,
    getPostesSorted
}


/*

{"post_ID":1,
"user_ID":"ibrahim",
"title":"ibrahim@gmail.come",
"content":"1234",
"date":""}
*/