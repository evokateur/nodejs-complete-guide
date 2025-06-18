import 'dotenv/config';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

// Impoort converted error controller
import * as errorController from './controllers/error';

// Temporarily keep require() for database-related modules
const mongoConnect = require('./util/database.js').mongoConnect;
const User = require('./models/user.js');

// Temporary type for user - will be replaced with Mongoose types later
declare global {
    namespace Express {
        interface Request {
            user?: any; // TODO: Replace with proper User type after Mongoose conversion
        }
    }
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// Import routes (these can be converted to TS)
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to attach user to request
app.use((req: Request, res: Response, next: NextFunction) => {
    User.findByUsername('default')
        .then((user: any) => {
            if (user) {
                req.user = new User(user.username, user.email, user.cart, user.id);
            }
            next();
        })
        .catch((err: any) => {
            console.log(err);
            next(); // Continue even if user lookup fails
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});
