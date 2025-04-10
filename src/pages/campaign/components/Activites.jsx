import { useState } from "react";
import { Star } from "lucide-react";
import Donations from "./Donations";
import Ratings from "./Ratings";
import Comments from "./Comments";
import { addComment } from "../../../lib/projects";


export default function Activities({ comments, ratings, donations, id }) {
    const [selectedTab, setSelectedTab] = useState("comments"); // Default to "comments"
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState(comments || []);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateComment = () => {
        if (!comment.trim()) {
            setError("Comment cannot be empty");
            return false;
        }
        if (comment.length < 3) {
            setError("Comment must be at least 3 characters");
            return false;
        }
        setError("");
        return true;
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!validateComment()) return;

        setIsSubmitting(true);

        try {
            const commentPayload = {
                body: comment,
                project: id
            }
            const response = await addComment(commentPayload);
            console.log(response.data)
            setCommentList([response.data, ...commentList]);
            setComment("");
        } catch (error) {
            setError("Failed to post comment. Please try again.");
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Leave a Comment</h3>
                <textarea
                    className="w-full border rounded-md p-2 mb-2"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value);
                        if (error) validateComment();
                    }}
                    rows={3}
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </form>
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
                <Comments comments={commentList} />
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