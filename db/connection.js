import { createConnection } from "mysql2";
const connection = createConnection({
    host :'localhost',
    user:'root',
    password:'',
    database:'node_user_post'
});

export default connection;