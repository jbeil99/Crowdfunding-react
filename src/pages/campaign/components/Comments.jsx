
import { Star } from "lucide-react"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function Comments({ comments, rating }) {
    const [comment, setComment] = useState('');

    const handleCommentSubmit = () => {
        if (!comment && rating === 0) return;
        setComments([...comments, { text: comment, rating }]);
        setComment('');
        setRating(0);
        toast.success("Comment submitted!");
    };
    return (
        <div className="pt-6">
            <h2 className="text-xl font-bold mb-4">Leave a comment & rating</h2>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-sm font-medium block mb-1">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                onClick={() => setRating(star)}
                                fill={rating >= star ? "currentColor" : "none"}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium block mb-1">Your Comment</label>
                    <Textarea
                        placeholder="Share your thoughts about this campaign"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none"
                        rows={4}
                    />
                </div>

                <Button
                // onClick={handleCommentSubmit}
                // disabled={!comment.trim() || rating === 0}
                >
                    Submit
                </Button>
            </div>

            {comments.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Comments & Ratings</h3>
                    <ul className="space-y-4">
                        {comments.map((c, i) => (
                            <li key={i} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="w-4 h-4"
                                            fill={c.rating >= star ? "currentColor" : "none"}
                                            color={c.rating >= star ? "#facc15" : "#d1d5db"}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-800 text-sm">{c.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}