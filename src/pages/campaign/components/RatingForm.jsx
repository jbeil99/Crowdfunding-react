import { useState } from "react";
import { addRatings } from "../../../lib/projects";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { use } from "react";


export default function RatingForm({ id }) {
    const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('')

    const handleStars = (newRating) => {
        setRating(newRating);
    };
    const handleRating = async () => {
        if (!rating || rating <= 0) return;

        setIsLoading(true);

        try {
            const response = await addRatings({
                rate: Number(rating),
                detail: comment
            }, id)

            if (response.status !== 201) {
                throw new Error('Failed to process donate');
            }
            toast.success(`Thank you for your rating!`);
            setIsBackDialogOpen(false);
            setRating(0);
            window.location.reload();
        } catch (error) {
            if (error.status === 401) {
                toast.error("Please login in first to rate");

            } else {
                toast.error('Failed to process rating: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full mb-2">Rate this project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rate this project</DialogTitle>
                    <DialogDescription>
                        Please rate the project and dont be sus
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Rate this project
                        </label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleStars(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        size={24}
                                        className={`${rating >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Comment (optional)
                        </label>
                        <Input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Leave a comment"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsBackDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRating}
                        disabled={!rating || rating <= 0 || isLoading}
                    >
                        {isLoading ? "Processing..." : "Complete Rate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}