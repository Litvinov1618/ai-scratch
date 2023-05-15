const fetchPosts = async () => {
    try {
        const res = await fetch("http://localhost:5001/notes", {
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