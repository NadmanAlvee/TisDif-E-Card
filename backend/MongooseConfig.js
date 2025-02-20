const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);

		console.log("MongoDB Connected Successfully");
	} catch (error) {
		console.error("MongoDB Connection Error:", error.message);
		process.exit(1);
	}
};

// Event Listeners for Database Connection Issues
mongoose.connection.on("disconnected", () => {
	console.warn("MongoDB Disconnected. Reconnecting...");
	connectDB();
});

mongoose.connection.on("error", (err) => {
	console.error("MongoDB Connection Error:", err);
});

module.exports = connectDB;
