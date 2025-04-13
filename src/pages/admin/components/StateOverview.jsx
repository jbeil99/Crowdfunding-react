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


export default function StateOverview({ campaigns, count }) {
    const totalCampaigns = count;
    const approvedCampaigns = campaigns.filter(c => c.is_active).length;
    const featuredCampaigns = campaigns.filter(c => c.is_featured).length;
    const totalTarget = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.total_target), 0);

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
                        <p className="text-sm font-medium text-gray-500">Total Target</p>
                        <p className="text-2xl font-bold">${totalTarget.toLocaleString()}</p>
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