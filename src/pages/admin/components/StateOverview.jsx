import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    DollarSign,

    FileText,

    Check,

    Star
} from 'lucide-react';


export default function StateOverview({ campaigns, count, statistics }) {
    const totalCampaigns = count;
    const approvedCampaigns = statistics.total_active_projects;
    const featuredCampaigns = statistics.total_featured;
    const totalDonations = statistics.total_money_raised;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
                <CardContent className="flex items-center justify-between pt-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                        <p className="text-2xl font-bold">{totalCampaigns}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-between pt-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Featured Campaigns</p>
                        <p className="text-2xl font-bold">{featuredCampaigns}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-between pt-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Donations</p>
                        <p className="text-2xl font-bold">${totalDonations}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-between pt-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                        <p className="text-2xl font-bold">{approvedCampaigns}</p>
                    </div>
                    <Check className="h-8 w-8 text-purple-500" />
                </CardContent>
            </Card>
        </div>
    )
}