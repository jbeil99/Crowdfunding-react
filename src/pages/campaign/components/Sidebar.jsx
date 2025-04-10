import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from 'sonner';

export default function SideBar({ campaign }) {
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
    const [pledgeAmount, setPledgeAmount] = useState('');
    const handlePledge = () => {
        toast.success(`Thank you for your support of $${pledgeAmount}!`);
        setIsBackDialogOpen(false);
        setPledgeAmount('');
    };


    const percentRaised = Math.min(
        Math.round((campaign.total_donations / campaign.total_target) * 100),
        100
    );
    return (
        <div>
            <Card className="sticky top-6">
                <CardHeader>
                    <CardTitle>Campaign Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="text-3xl font-bold">${campaign.total_donations || 0}</div>
                        <div className="text-sm text-gray-500">
                            raised of ${campaign.total_target} goal
                        </div>
                    </div>

                    <Progress value={percentRaised} className="h-2 mb-4" />

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <div className="text-xl font-bold">{percentRaised}%</div>
                            <div className="text-sm text-gray-500">Funded</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">{campaign.backers}</div>
                            <div className="text-sm text-gray-500">Backers</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">{campaign.daysLeft}</div>
                            <div className="text-sm text-gray-500">Days Left</div>
                        </div>
                    </div>

                    <Dialog open={isBackDialogOpen} onOpenChange={setIsBackDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full mb-2">Back this project</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Support this project</DialogTitle>
                                <DialogDescription>
                                    Enter an amount you would like to contribute
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-4">
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

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsBackDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handlePledge} disabled={!pledgeAmount || pledgeAmount <= 0}>
                                    Complete Pledge
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full">Share</Button>
                </CardContent>
                <CardFooter className="bg-gray-50 text-sm text-gray-500 border-t">
                    <p>This project will only be funded if it reaches its goal by the deadline.</p>
                </CardFooter>
            </Card>
        </div>
    )
}