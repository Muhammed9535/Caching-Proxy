import {createClient} from "redis"


const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
    console.error("Redis client error", err);
})

export async function connectRedis (){
    await client.connect()
    console.log("Redis connected");
    
}




export default client