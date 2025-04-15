import {
    Card,

    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    TabsContent,

} from '@/components/ui/tabs';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import CampainsTable from "./CampainsTable"


export default function CampaignTab({ isLoading, filteredCampaigns, setSelectedCampaign, setShowDeleteAlert, filterStatus, setFilterStatus, handleViewDetails, handleStatusUpdate, handleFeaturedUpdate, navigateToEditProject, handleLoadMore, nextPageUrl, handleAcceptUpdate }) {
    return (<TabsContent value="campaigns">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Campaigns Management</CardTitle>
                    <div className="flex gap-2">
                        <Select
                            value={filterStatus}
                            onValueChange={(value) => setFilterStatus(value)}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Inactive</SelectItem>
                                <SelectItem value="approved">Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            {/* Campaigns Table */}
            <CampainsTable isLoading={isLoading} filteredCampaigns={filteredCampaigns} setSelectedCampaign={setSelectedCampaign} setShowDeleteAlert={setShowDeleteAlert} handleViewDetails={handleViewDetails} handleStatusUpdate={handleStatusUpdate} handleFeaturedUpdate={handleFeaturedUpdate} navigateToEditProject={navigateToEditProject} handleAcceptUpdate={handleAcceptUpdate} />
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
    </TabsContent>)
}