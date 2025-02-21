const { MongoClient } = require("mongodb");
const {mongoUsername, mongoPassword, mongoCluster, mongoDatabase, mongoCollection} = require('./../config.json')
const client = new MongoClient(`mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoCluster}.mongodb.net/?retryWrites=true&w=majority`)
function query(query) {
    let result
    try {
        await client.connect()
        const collection = client.db(mongoDatabase).collection(mongoCollection)
        result = await collection.find(query).toArray()
    } catch (error) {
        console.error(error)
        result = undefined
    } finally {
        client.close()
    }
    return result
}