import { Connection } from "mongoose"


declare global {
    var mongoose:{                                  //append new object in global
        conn:Connection | null,                     //conn is Connection type
        promise:Promise<Connection> | null          //promise is Promise type and Promise is Promise of Connection
    }
}

export {}




//In Next.js, due to hot reload and serverless behavior, code runs multiple times. So we store the DB connection in a global variable to avoid creating multiple connections. Using declare global var allows TypeScript to recognize that global cache.
