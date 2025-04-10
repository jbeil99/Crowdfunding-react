import { useState } from "react";
import Donations from "./Donations";
import Ratings from "./Ratings";
import Comments from "./Comments";

export default function Activities({ comments, ratings, donations, id }) {
    const [selectedTab, setSelectedTab] = useState("comments"); // Default to "comments"

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            {/* Comment Form */}

            <h2 className="text-xl font-bold mb-4">Backer Comments & Ratings</h2>

            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b mb-4">
                <button
                    className={`pb-2 ${selectedTab === "comments" ? "border-b-2 border-blue-600" : ""}`}
                    onClick={() => setSelectedTab("comments")}
                >
                    Comments
                </button>
                <button
                    className={`pb-2 ${selectedTab === "donations" ? "border-b-2 border-blue-600" : ""}`}
                    onClick={() => setSelectedTab("donations")}
                >
                    Donations
                </button>
                <button
                    className={`pb-2 ${selectedTab === "ratings" ? "border-b-2 border-blue-600" : ""}`}
                    onClick={() => setSelectedTab("ratings")}
                >
                    Ratings
                </button>
            </div>

            {/* Tab Content */}
            {selectedTab === "comments" && (
                <Comments projectID={id} />
            )}

            {selectedTab === "donations" && (
                <Donations donations={donations} />
            )}

            {selectedTab === "ratings" && (
                <Ratings ratings={ratings} />
            )}
        </div>
    );
}