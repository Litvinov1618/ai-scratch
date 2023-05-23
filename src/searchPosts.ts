import { SERVER_HOST } from "./constants";

const searchPosts = async (searchValue: string, userEmail: string) => {
    try {
        const res = await fetch(`${SERVER_HOST}/notes/search?search_value=${searchValue}&user_email=${userEmail}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const posts = await res.json();

        if (posts.error) {
            return {
                posts: [],
                aiResponse: "Error while searching posts: " + posts.error,
                error: true,
            }
        }

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export default searchPosts;