'use strict';
const dotEnv = require('dotenv');
dotEnv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.DB_URI2, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
	writeConcern: {
		w: 'majority',
		wtimeout: 0,
		provenanceSource: 'clientSupplied',
	},
});

async function start() {
	try {
		// Connect the client to the server
		await client.connect();
		const app = require('../app');
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
	} catch (error) {
		console.error('Error connecting to the database: ', error);
	}
}

start();
module.exports = client;
