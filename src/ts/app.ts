import 'dotenv/config';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import * as errorController from './controllers/error';
import User, { IUser } from './models/user';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use((req: Request, res: Response, next: NextFunction) => {
    User.findOne({ username: 'default' })
        .then((user: IUser | null) => {
            if (user) {
                req.user = user;
            } else {
                const defaultUser = new User({
                    username: 'default',
                    email: 'juan@foo.net',
                    cart: { items: [] }
                });
                return defaultUser.save().then((newUser: IUser) => {
                    req.user = newUser;
                });
            }
            next();
        })
        .catch((err: any) => {
            console.log('Error finding/creating user:', err);
            next(); // Continue even if user lookup fails
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

connectDB();
