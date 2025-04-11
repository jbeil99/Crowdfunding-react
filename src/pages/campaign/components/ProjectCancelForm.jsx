import { useState } from "react";
import { cancelProject } from "../../../lib/projects";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProjectCancelForm({ id }) {
    const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    const handleCancel = async () => {
        setIsLoading(true);

        try {
            const response = await cancelProject(id)
            console.log(response)
            if (response.status !== 200) {
                throw new Error('Failed to process Cancel');
            }
            toast.success(`Project is Canceld!`);
            setIsBackDialogOpen(false);
            navigate("/profile")
        } catch (error) {
            if (error.status === 401) {
                toast.error("Please login in first to report");

            } else {
                for (const k of Object.keys(error.response.data)) {
                    toast.error('Failed to process report: ' + error.response.data[k].join("\n"));
                }
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
                    Cancel
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel this Project</DialogTitle>
                    <DialogDescription>
                        You cant open a proect again after canceling
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsBackDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCancel}
                    >
                        {isLoading ? "Processing..." : "Complete Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}