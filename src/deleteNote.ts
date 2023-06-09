const deleteNote = async (id: string): Promise<Response> => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/notes/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return res;
    }

    return res;
}

export default deleteNote;