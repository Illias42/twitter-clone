var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "./models/User";
import createHash from "./utils/createHash";
passport.use(new LocalStrategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("email: ", username);
        const user = yield UserModel.findOne({ email: username }).lean();
        if (!user) {
            done(null, false);
        }
        else if (user.password == createHash(password, user.salt)) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    }
    catch (err) {
        done(err, false);
    }
})));
passport.use(new JWTstrategy({
    secretOrKey: 'secret',
    jwtFromRequest: ExtractJwt.fromHeader('token'),
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel.findById(payload.data._id).exec();
        if (user) {
            return done(null, user);
        }
        done(null, false);
    }
    catch (error) {
        done(error, false);
    }
})));
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
export { passport };
