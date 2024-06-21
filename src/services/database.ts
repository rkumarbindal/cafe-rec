/* eslint-disable @typescript-eslint/no-floating-promises */
import { Connection, QueryError, createConnection } from 'mysql2/promise';

class DatabaseService {
    private sqlConnection: Connection | null = null;

    constructor() {
        this.init();
    }

    async init() {
        if (this.sqlConnection) {
            return;
        }
        try {
            this.sqlConnection = await createConnection({
                host: '127.0.0.1',
                port: 3306,
                user: 'nodeuser',
                password: 'nodeuser@1234',
                database: 'cafe-rec'
            });
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }

    async disconnect(): Promise<void> {
        if (this.sqlConnection) {
            try {
                await this.sqlConnection.end();
                console.log('Disconnected from the database');
            } catch (error) {
                console.error('Error disconnecting from the database:', error);
            }
            this.sqlConnection = null;
        }
    }

    async execute(query: string): Promise<unknown> {
        if (!this.sqlConnection) {
            throw new Error('Database not connected');
        }
        try {
            const [results] = await this.sqlConnection.execute(query, []);
            return results;
        } catch (err) {
            console.error(`Error executing query -- ${query}\n ERROR: ${((err) as QueryError).message}`);
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;