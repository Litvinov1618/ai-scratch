import { IPost } from "./App";

const updatePost = async (post: IPost) => {
    try {
        const res = await fetch(`http://localhost:5001/notes/${post.id}`, {
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