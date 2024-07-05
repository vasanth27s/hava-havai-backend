import pg from "pg";
const { Pool } = pg;

const postgres = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

postgres.connect((err) => {
    if (err) {
        console.error("Error while connecting to the database: ", err);
        process.exit(1);
    }
    console.log("Connected to PostgreSQL successfully!");
});

export default postgres;
