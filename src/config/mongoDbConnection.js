import { connect } from "mongoose"

const connectDb = async () => {
  console.log(process.env.URI_DB)
  try {
    await connect(process.env.URI_DB)
    console.log("✅ Conectado a MongoDb")
  } catch (error) {
    console.log("❌ Error al conectarse a MongoDb", error.message)
  }
}

export { connectDb }