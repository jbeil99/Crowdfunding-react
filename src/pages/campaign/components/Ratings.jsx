import { Star } from "lucide-react";

export default function Ratings({ ratings }) {
    return (
        <div>
            {ratings.length > 0 ? (
                <ul className="space-y-4">
                    {ratings.map((item, i) => (
                        <li key={i} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                                <img
                                    src={item.user.profile_picture || "http://127.0.0.1:8000/media/images/default_avatar.jpg"}
                                    alt={`${item.user.first_name} ${item.user.last_name}`}
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
                                    <p className="mt-2 text-gray-800 text-sm">{item.comment}</p> {/* Show rating details */}
                                    <div className="mt-2 text-xs text-gray-500">
                                        By {item.user?.first_name ? `${item.user.first_name} ${item.user.last_name}` : 'Anonymous'} • {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500">No ratings yet.</div>
            )}
        </div>
    );
}
