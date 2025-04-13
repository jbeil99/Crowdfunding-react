import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import DonationForm from "./DonationForm";
import RatingForm from "./RatingForm";
import PorjectReportForm from "./PorjectReportForm";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../../store/auth";
import { useEffect } from "react";
import ProjectCancelForm from "./ProjectCancelForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { calculateDaysLeft } from "../../../lib/helpers";

export default function SideBar({ campaign, id }) {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const percentRaised = Math.round((campaign.total_donations / campaign.total_target) * 100);

    useEffect(() => {
        dispatch(getUser())
    }, []);

    // Function to render stars based on rating
    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    size={16}
                    fill="#FFD700"
                    color="#FFD700"
                    className="mr-1"
                />
            );
        }

        // Half star
        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative mr-1">
                    <Star size={16} color="#E5E7EB" />
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <Star size={16} fill="#FFD700" color="#FFD700" />
                    </div>
                </div>
            );
        }

        // Empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={16} color="#E5E7EB" className="mr-1" />);
        }

        return stars;
    };

    return (
        <div>
            <Card className="sticky top-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Campaign Progress</CardTitle>
                        {(user?.is_staff || user?.id === campaign.owner.id) && (
                            <Link to={`/projects/edit/${id}`}>
                                <Button variant="outline" size="sm">
                                    Edit Project
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="text-3xl font-bold">${campaign.total_donations || 0}</div>
                        <div className="text-sm text-gray-500">
                            raised of ${campaign.total_target} goal
                        </div>

                        {/* Rating section */}
                        <div className="flex items-center mt-2">
                            <div className="flex mr-2">
                                {renderRatingStars(campaign.rating || 0)}
                            </div>
                            <span className="text-sm text-gray-500">
                                {campaign.rating?.toFixed(1) || 0} ({campaign.review_count || 0} reviews)
                            </span>
                        </div>
                    </div>

                    <Progress value={percentRaised} className="h-2 mb-4" />

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <div className="text-xl font-bold">{percentRaised}%</div>
                            <div className="text-sm text-gray-500">Funded</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">{campaign.backers_count}</div>
                            <div className="text-sm text-gray-500">Backers</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">{calculateDaysLeft(campaign)}</div>
                            <div className="text-sm text-gray-500">Days Left</div>
                        </div>
                    </div>

                    <DonationForm id={id} />
                    <RatingForm id={id} />
                    <PorjectReportForm id={id} />
                    {user?.id === campaign.owner.id || user?.is_staff ? <ProjectCancelForm id={id} /> : ""}
                </CardContent>
                <CardFooter className="bg-gray-50 text-sm text-gray-500 border-t">
                    <div className="w-full">
                        <p className="mb-2">This project will only be funded if it reaches its goal by the deadline.</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}