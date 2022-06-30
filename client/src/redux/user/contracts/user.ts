export interface IUserData {
    _id: string,
    name: string,
    surname?: string,
    email: string,
    likedTweets: string[],
    bookmarks: string[],
    followers: string[],
    followings: string[],
    avatar: string,
    tag?: string
}

export interface IUser {
    _id: string,
    name: string,
    avatar: string
}