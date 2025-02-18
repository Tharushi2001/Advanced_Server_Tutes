const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

// Create API keys table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS api_keys (
            id TEXT PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_used DATETIME,
            is_active INTEGER DEFAULT 1
        )
    `);
});

class ApiKey {
    // Create a new API key
    static async create(name) {
        const id = uuidv4();
        const key = uuidv4();

        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO api_keys (id, key, name) VALUES (?, ?, ?)',
                [id, key, name],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, key, name });
                }
            );
        });
    }

    // Validate an API key
    static async validate(key) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM api_keys WHERE key = ? AND is_active = 1',
                [key],
                (err, row) => {
                    if (err) reject(err);
                    else {
                        if (row) {
                            db.run(
                                'UPDATE api_keys SET last_used = DATETIME("now") WHERE key = ?',
                                [key]
                            );
                        }
                        resolve(row);
                    }
                }
            );
        });
    }
}

module.exports = ApiKey;
