import sql from 'mssql/msnodesqlv8.js';

const dbConfig = {
    server: 'ELKORSAN',
    database: 'dummydb',
    options: {
        // windows authentication
        trustedConnection: true
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