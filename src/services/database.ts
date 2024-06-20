import mysql2, { Connection } from 'mysql2';

class DatabaseService {

    sql!: Connection;

    constructor() {
        this.init();
    }

    init() {
        this.sql = mysql2.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'nodeuser',
            password: 'nodeuser@1234',
            database: 'cafe-rec'
        });
    }

    select() {
        try {
            this.sql.query(
                'SELECT * FROM t_user',
                function (err, results, fields) {
                    console.log(results);
                    console.log(fields);
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;