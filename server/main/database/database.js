import sql from 'mssql/msnodesqlv8.js';

const dbConfig = {
    server: 'localhost',
    database: 'dummydb',
    driver: 'ODBC Driver 17 for SQL Server',
    user: 'sa',
    password: '123456789',
    options: {
        // windows authentication
    }
}

function connect() {
    // promise
    return new Promise((resolve, reject) => {
        sql.connect(dbConfig).then(() => {
            console.log('Connected to database');
            // select * from users

            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });


}

export default connect;