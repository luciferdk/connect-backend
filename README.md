1. npm install first
2. make sure all dependency are installed.
3.  write all credintial in .env file
4. npx prisma migrate status // to check prisma migration done or not
5. first migrate the prisma
6. generate the client of prisma
7. do dev, buld, start enverment as you need

/* to check error and hint to fix error */
-> npm install -D nodemon ts-node concurrently 


**Running Server Startegy*
-> ESLint all thiings are written on eslint.config.mjs
1. to create this file you had to run 

-> touch nodemon.json /*create this file*/
{
"watch":["src"],
"ext": "ts",
"exec": "ts-node src/index.ts"
}

-> package.json /*change the script*/
"scripts": {
    "build": "tsc -b && cp -r ./src/generated ./dist/generated",
    "start": "node dist/index.js",
    "dev": "concurrently -k -n \"LINT,NODE\" -c \"yellow.bold,cyan.bold\" \"npm run lint:watch\" \"npm run serve\"",
    "lint:watch": "nodemon --watch src --ext ts --exec \"npm run lint:check\"",
    "lint:check": "eslint . --ext .ts",
    "serve": "nodemon --watch src --ext ts --exec ts-node src/index.ts"
  },

-> tsconfig.json /*write after compilerOptions*/
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],    // 👈 MUST be written
  "exclude": ["node_modules"] //this will also written
}
->{npm run dev /*Real-time run the code & relode development envirment*/}
->{npm run build /*One time compile and copy the file for production level*/}
->{npm start /*run Production version*/}



 ---before run your code---
 -> npx prisma migrated dev
 -> npx prisma generate
 -> npm run build
 -> node dist/index.js



*** env file configration of credintial ***
```

DATABASE_URL="postgres://avnadmin:AsdfdsT@pg-294bcd82-psotgraceaiven.l.aivencloud.com:21132/defaultdb?sslmode=require"

NODE_ENV=production
FRONTEND_URL=https://mydomain.com
JWT_SECRET=huddgyeguru
FAST2SMS_API_KEY=QEnCH31S1Dq243RE43545Y4WE3wU5sIB3P8JOEU6JEYoGjUbY0

REDIS_URL=redis://default:XBKFsoPvT3si36@redis-12111.c240.us-east-1-3.cloud.com:12111

CLOUDINARY_CLOUD_NAME=dg9wfsllxv5
CLOUDINARY_API_SECRET=vutqljsjflr3rj54l3k654l54k
CLOUDINARY_API_KEY=686535544635795


PORT = 8080

```
this is for local redis befor this install on you machine
import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
    console.log("Redis Connected");
    })
*/
