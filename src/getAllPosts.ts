import { SERVER_HOST } from "./constants";

const getAllPosts = async () => {
    try {
        const userEmail = sessionStorage.getItem("user_email");
        if (!userEmail) throw new Error("User email not found");
        const res = await fetch(`${SERVER_HOST}/notes?user_email=${userEmail}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const posts = await res.json();

        return posts;
    } catch (error) {
        console.log(error);
    }
};

export default getAllPosts;