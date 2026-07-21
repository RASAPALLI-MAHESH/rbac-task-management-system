import mongoose from "mongoose";

const databaseConnect = async () => {
    const connectedUri = process.env.CONNECTION_STRING;
    const directUri = process.env.CONNECTION_STRING_DIRECT;

    if (!connectedUri) {
        console.log("Database connection failed: CONNECTION_STRING is missing. Check src/.env loading path.");
        process.exit(1);
    }

    try {
        const dbConnection = await mongoose.connect(connectedUri);
        console.log(`Database connected successfully: ${dbConnection.connection.host} ${dbConnection.connection.name}`);
    } catch (error) {
        console.log("SRV failed, using fallback connection ...");
        console.log(`Database connection failed: ${error.message}`);

        if (!directUri) {
            console.log("Database fallback connection failed: CONNECTION_STRING_DIRECT is missing.");
            process.exit(1);
        }
        try {
            const dbConnection = await mongoose.connect(directUri);
            console.log(`Database connected successfully (fallback): ${dbConnection.connection.host} ${dbConnection.connection.name}`);
        } catch (fallbackError) {
            console.log(`Database fallback connection failed: ${fallbackError.message}`);
            process.exit(1);
        }
    }
};
export default databaseConnect;