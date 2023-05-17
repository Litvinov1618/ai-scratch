import { SERVER_HOST } from "./constants";

const fetchPosts = async () => {
    try {
        const res = await fetch(`${SERVER_HOST}/notes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const posts = await res.json();

        return posts;
    } catch (error) {
        console.log(error);
    }
};

export default fetchPosts;