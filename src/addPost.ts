import { IPost } from "./App";
import { SERVER_HOST } from "./constants";

interface INewPost extends Omit<IPost, 'id' | 'delta' | 'text'> {
    user_email: string;
}

const addPost = async (post: INewPost) => {
    try {
        const res = await fetch(`${SERVER_HOST}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        });
        const posts = await res.json();

        return posts;
    } catch (error) {
        console.log(error);
    }
};

export default addPost;