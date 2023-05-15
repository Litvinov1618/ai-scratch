const deletePost = async (id: string) => {
    try {
        const res = await fetch(`http://localhost:5001/notes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
}

export default deletePost;