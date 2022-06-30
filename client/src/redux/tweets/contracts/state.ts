export interface ICreateTweet {
    data: FormData;
    userId: string;
}

export interface Tweet {
    pics: string[];
    likes: number;
    bookmarksCount: number;
    _id: string;
    text: string;
    user: {
        _id: string;
        name: string;
        surname: string;
        avatar: string;
        tag?: string;
    },
    replyCount: number
}

export interface Reply {
    text: string;
    user: {
        _id: string,
        name: string,
        avatar: string
    }
}

export interface TweetState {
    items: Tweet[];
    replies: Reply[];
    loading: Boolean;
    end: Boolean;
}