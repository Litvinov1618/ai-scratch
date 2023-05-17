import { IPost } from "./App";

const addPost = async (post: Omit<IPost, 'id'>) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_AI_SCRATCH_SERVER_HOST}/notes`, {
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