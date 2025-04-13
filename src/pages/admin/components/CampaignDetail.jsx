import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Badge,
} from '@/components/ui/badge';

export default function CampaignDetail({ selectedCampaign, showDetailsDialog, setShowDetailsDialog, reports }) {
    return (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            {selectedCampaign && (
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedCampaign.title} - Reports</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        {reports && reports.length > 0 ? (
                            <div className="space-y-4">
                                {reports.map((report, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge>Report #{index + 1}</Badge>
                                            <span className="text-sm text-gray-500">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{report.reason}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Reported by: User #{report.user_id}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No reports found for this campaign</p>
                        )}
                    </div>
                </DialogContent>
            )}
        </Dialog>
    )
}