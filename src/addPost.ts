import { IPost } from "./App";
import { SERVER_HOST } from "./constants";

const addPost = async (post: Omit<IPost, 'id'>) => {
    try {
        const userEmail = sessionStorage.getItem("user_email");
        if (!userEmail) throw new Error("User email not found");
        const res = await fetch(`${SERVER_HOST}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...post, user_email: userEmail }),
        });
        const posts = await res.json();

        return posts;
    } catch (error) {
        console.log(error);
    }
};

export default addPost;