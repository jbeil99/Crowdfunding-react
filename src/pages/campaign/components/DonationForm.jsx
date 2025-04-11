import { useState } from "react";
import { addDonation } from "../../../lib/projects";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function DonationForm({ id }) {
    const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pledgeAmount, setPledgeAmount] = useState('');
    const handlePledge = async () => {
        if (!pledgeAmount || pledgeAmount <= 0) return;

        setIsLoading(true);

        try {
            const response = await addDonation({
                amount: Number(pledgeAmount),
            }, id)

            if (response.status !== 201) {
                throw new Error('Failed to process donate');
            }
            toast.success(`Thank you for your support of $${pledgeAmount}!`);
            setIsBackDialogOpen(false);
            setPledgeAmount('');
            window.location.reload();
        } catch (error) {
            if (error.status === 401) {
                toast.error("Please login in first to donation");

            } else {
                toast.error('Failed to process donation: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full mb-2">Back this project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Support this project</DialogTitle>
                    <DialogDescription>
                        Enter an amount you would like to contribute and rate the project
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Pledge Amount ($)
                        </label>
                        <Input
                            type="number"
                            value={pledgeAmount}
                            onChange={(e) => setPledgeAmount(e.target.value)}
                            placeholder="10"
                            min="1"
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
                        onClick={handlePledge}
                        disabled={!pledgeAmount || pledgeAmount <= 0 || isLoading}
                    >
                        {isLoading ? "Processing..." : "Complete Pledge"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}