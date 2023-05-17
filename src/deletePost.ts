const deletePost = async (id: string) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/notes/${id}`, {
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