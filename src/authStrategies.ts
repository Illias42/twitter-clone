import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {Strategy as JWTstrategy, ExtractJwt} from "passport-jwt";
import {UserModel, IUser} from "./models/User";
import createHash from "./utils/createHash";

passport.use(
    new LocalStrategy(async (username, password, done) => {
            try {
                console.log("email: ", username);
                const user = await UserModel.findOne({email: username}).lean();

                if(!user) {
                    done(null, false);
                } else if(user.password == createHash(password, user.salt)) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (err) {
                done(err, false);
            }
        }
    )
)

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'secret',
            jwtFromRequest: ExtractJwt.fromHeader('token'),
        },
        async (payload: { data: IUser }, done): Promise<void> => {
            try {
                const user = await UserModel.findById(payload.data._id).exec();

                if (user) {
                    return done(null, user);
                }

                done(null, false);
            } catch (error) {
                done(error, false);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: IUser, done) => {
    done(null, user);
});

export {passport};