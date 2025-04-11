import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import axios from "axios";
import { useState, useEffect } from "react";
import { getUserDonations } from "../../../lib/projects";
import { Link } from "react-router-dom";

function getSinceLabel(createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - createdDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
    }

    const diffInMonths = now.getMonth() - createdDate.getMonth() + (12 * (now.getFullYear() - createdDate.getFullYear()));
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }

    const diffInYears = now.getFullYear() - createdDate.getFullYear();
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}


export default function Campaign({ user }) {
    const [campaignList, setCampaignList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);


    const fetchCampaigns = async (url) => {
        try {
            const response = await axios.get(url);
            const data = response.data;
            setCampaignList((prev) => {
                if (campaignList.length > 0) {
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
        if (user) {
            const initialUrl = `http://127.0.0.1:8000/api/projects?user=${user?.id}&page_size=4`;
            fetchCampaigns(initialUrl);
        }
    }, [user?.id]);

    const handleLoadMore = () => {
        if (nextPageUrl) {
            setLoading(true);
            fetchCampaigns(nextPageUrl);
        }
    };


    if (loading && campaignList.length === 0)
        return <div className="text-center py-8 text-gray-500">Loading Campaigns...</div>;

    return <>
        <Card>
            <CardHeader>
                <CardTitle>My Campaigns</CardTitle>
                <CardDescription>
                    Campaigns you've created and are managing
                </CardDescription>
            </CardHeader>
            <CardContent>
                {campaignList.map((camp, index) => {
                    return <div className="flex justify-between items-center border-b border-gray-200 py-4" key={index + 1}>
                        <div>
                            <Link to={`/campaign/${camp.id}`}><h3 className="font-medium">{camp.title}</h3></Link>
                            <p className="text-sm text-gray-600">Started {getSinceLabel(camp.created_at)}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">${camp.total_donations} / ${camp.total_target}</p>
                            <p className="text-sm text-green-600">{camp.is_active ? "Active" : "Canceled"}</p>
                        </div>
                    </div>
                })}
            </CardContent>
        </Card>

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
    </>
}