import { useEffect, useState } from "react";
import axios from "axios";
import { addComment, getComments } from "../../../lib/projects";
import CommentReportForm from "./CommentReportForm";

export default function Comments({ projectID }) {
    const [commentList, setCommentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [comment, setComment] = useState("");
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
    const fetchComments = async (url) => {
        try {
            const response = await getComments(projectID, url);
            const data = response.data;
            setCommentList((prev) => {
                if (commentList.length > 0) {
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
        fetchComments();
    }, [projectID]);

    const handleLoadMore = () => {
        if (nextPageUrl) {
            setLoading(true);
            fetchComments(nextPageUrl);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!validateComment()) return;

        setIsSubmitting(true);

        try {
            const commentPayload = {
                body: comment,
            }
            const response = await addComment(commentPayload, projectID);
            setCommentList([response.data, ...commentList])
            setComment("");
        } catch (error) {
            if (error.status === 401) {
                setError("Please login in first to comment");
            } else {
                setError("Failed to post comment. Please try again.");
            }
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && commentList.length === 0)
        return <div className="text-center py-8 text-gray-500">Loading comments...</div>;


    return (
        <div>
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
            {commentList.length > 0 ? (
                <ul className="space-y-4">
                    {commentList.map((item) => (
                        <li key={item.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start space-x-4">
                                <img
                                    src={item.user?.profile_picture || "http://127.0.0.1:8000/media/images/default_avatar.jpg"}
                                    alt={`${item.user?.first_name || 'User'} ${item.user?.last_name || ''}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-gray-800 text-sm break-words break-all whitespace-pre-wrap">
                                            {item.body}
                                        </p>
                                        <div className="ml-2 shrink-0">
                                            <div className="text-xs">
                                                <CommentReportForm id={item.id} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        By {item.user?.first_name ? `${item.user?.first_name} ${item.user?.last_name}` : "Anon"} •{" "}
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
