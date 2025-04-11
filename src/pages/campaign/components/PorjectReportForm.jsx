import { useState } from "react";
import { addProjectReports } from "../../../lib/projects";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function PorjectReportForm({ id }) {
    const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('')

    const handleReport = async () => {
        if (!comment) return;

        setIsLoading(true);

        try {
            const response = await addProjectReports({
                details: comment
            }, id)

            if (response.status !== 201) {
                throw new Error('Failed to process report');
            }
            toast.success(`Thank you for your Report!`);
            setIsBackDialogOpen(false);
            setComment("")
        } catch (error) {
            if (error.status === 401) {
                toast.error("Please login in first to report");

            } else {
                toast.error('Failed to process report: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full mb-2"
                    variant="destructive"
                >
                    Report
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>report this project</DialogTitle>
                    <DialogDescription>
                        Your report will be seen by admins
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Report details
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
                        onClick={handleReport}
                        disabled={!comment || isLoading}
                    >
                        {isLoading ? "Processing..." : "Complete Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}