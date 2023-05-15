import { IPost } from "./App";

const addPost = async (post: Omit<IPost, 'id'>) => {
    try {
        const res = await fetch("http://localhost:5001/notes", {
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