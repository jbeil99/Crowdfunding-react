import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DonationForm from "./DonationForm";
import RatingForm from "./RatingForm";
import PorjectReportForm from "./PorjectReportForm";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../../store/auth";
import { useEffect } from "react";
import ProjectCancelForm from "./ProjectCancelForm";


export default function SideBar({ campaign, id }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const percentRaised = Math.round((campaign.total_donations / campaign.total_target) * 100);
    useEffect(() => {
        if (sessionStorage.getItem('accessToken')) {
            dispatch(getUser())
        }
    }, [id])

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

                    <DonationForm id={id} />
                    <RatingForm id={id} />
                    <PorjectReportForm id={id} />
                    {user?.id === campaign.owner.id ? <ProjectCancelForm id={id} /> : ""}
                </CardContent>
                <CardFooter className="bg-gray-50 text-sm text-gray-500 border-t">
                    <p>This project will only be funded if it reaches its goal by the deadline.</p>
                </CardFooter>
            </Card>
        </div>
    );
}