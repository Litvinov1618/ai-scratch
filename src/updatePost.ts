import { IPost } from "./App";
import { SERVER_HOST } from "./constants";

const updatePost = async (post: IPost) => {
    try {
        const res = await fetch(`${SERVER_HOST}/notes/${post.id}`, {
            method: "PUT",
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
}

export default updatePost;