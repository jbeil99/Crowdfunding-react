import { useState, useEffect } from "react";
import { getDonations } from "../../../lib/projects";

export default function Donations({ projectID }) {
    const [donationsList, setDonationsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const fetchDonations = async (url) => {
        try {
            const response = await getDonations(projectID, url);
            const data = response.data;
            setDonationsList((prev) => {
                if (donationsList.length > 0) {
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
        fetchDonations();
    }, [projectID]);

    const handleLoadMore = () => {
        if (nextPageUrl) {
            setLoading(true);
            fetchDonations(nextPageUrl);
        }
    };
    return (
        <div>
            {donationsList?.length > 0 ? (
                <ul className="space-y-4">
                    {donationsList.map((item, i) => (
                        <li key={i} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                                <img
                                    src={item.user?.profile_picture || "http://127.0.0.1:8000/media/images/default_avatar.jpg"}
                                    alt={`${item.user?.first_name} ${item.user?.last_name}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="text-sm text-green-600 font-medium">
                                        ${item.amount} donation
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        By {item.user?.first_name ? `${item.user.first_name} ${item.user.last_name}` : 'Anonymous'} • {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500">No donations yet.</div>
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
