import express, { Request, Response } from 'express';
import { createServer } from 'http';
import * as dotenv from 'dotenv'
import studentRoutes from './routes/student.route'
import cors from "cors"

const app = express();
dotenv.config();

app.use(cors())
app.use(express.json());
app.use('/students', studentRoutes)


const server = createServer(app);


const port = process.env.PORT || 10000;

server.listen(port, () => {
});
