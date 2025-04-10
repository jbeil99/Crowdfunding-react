export default function Donations({ donations }) {
    return (
        <div>
            {donations.length > 0 ? (
                <ul className="space-y-4">
                    {donations.map((item, i) => (
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
        </div>
    );
}
