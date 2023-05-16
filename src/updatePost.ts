import { IPost } from "./App";

const updatePost = async (post: Omit<IPost, "embedding" | "id">, id: string) => {
    try {
        const res = await fetch(`http://localhost:5001/notes/${id}`, {
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