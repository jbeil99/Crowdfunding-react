import { Star } from "lucide-react";
import { getRatings } from "../../../lib/projects";
import { useState, useEffect } from "react";

export default function Ratings({ projectID }) {
    const [ratingsList, setRatingsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const fetchRatings = async (url) => {
        try {
            const response = await getRatings(projectID, url);
            const data = response.data;
            setRatingsList((prev) => {
                if (ratingsList.length > 0) {
                    return [...prev, ...data.results]
                } else {
                    return [...data.results]
                }
            });
            setNextPageUrl(data.next);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            setError("Something went wrong while fetching comments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [projectID]);

    const handleLoadMore = () => {
        if (nextPageUrl) {
            setLoading(true);
            fetchRatings(nextPageUrl);
        }
    };


    if (loading && ratingsList.length === 0)
        return <div className="text-center py-8 text-gray-500">Loading comments...</div>;


    return (
        <div>
            {ratingsList?.length > 0 ? (
                <ul className="space-y-4">
                    {ratingsList.map((item, i) => (
                        <li key={i} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                                <img
                                    src={item.user?.profile_picture || "http://127.0.0.1:8000/media/images/default_avatar.jpg"}
                                    alt={`${item.user?.first_name} ${item.user?.last_name}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="w-4 h-4"
                                                fill={item.rate >= star ? "#facc15" : "none"} // Fill with yellow for rated stars
                                                color={item.rate >= star ? "#facc15" : "#d1d5db"} // Color for rated vs unrated stars
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-800 text-sm break-words break-all whitespace-pre-wrap">
                                        {item.detail}
                                    </p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        By {item.user?.first_name ? `${item.user?.first_name} ${item.user?.last_name}` : 'Anonymous'} • {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500">No ratings yet.</div>
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
