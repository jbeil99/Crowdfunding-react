import { useEffect, useState } from "react";
import axios from "axios";

export default function Comments({ projectID }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const fetchComments = async (url) => {
        try {
            const response = await axios.get(url);
            const data = response.data;
            setComments((prev) => [...prev, ...data.results]);
            setNextPageUrl(data.next);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            setError("Something went wrong while fetching comments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initialUrl = `http://127.0.0.1:8000/api/projects/${projectID}/comments`;
        fetchComments(initialUrl);
    }, [projectID]);

    const handleLoadMore = () => {
        if (nextPageUrl) {
            setLoading(true);
            fetchComments(nextPageUrl);
        }
    };

    if (loading && comments.length === 0)
        return <div className="text-center py-8 text-gray-500">Loading comments...</div>;

    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div>
            {comments.length > 0 ? (
                <ul className="space-y-4">
                    {comments.map((item) => (
                        <li key={item.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                                <img
                                    src={item.user.profile_picture || "http://127.0.0.1:8000/media/images/default_avatar.jpg"}
                                    alt={`${item.user.first_name || 'User'} ${item.user.last_name || ''}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-gray-800 text-sm break-words">{item.body}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        By {item.user.first_name} {item.user.last_name} •{" "}
                                        {new Date(item.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500">No comments yet.</div>
            )}

            {nextPageUrl && (
                <div className="text-center mt-4">
                    <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
