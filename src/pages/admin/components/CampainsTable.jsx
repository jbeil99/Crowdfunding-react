import {
    CardContent
} from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import {
    Button,
} from '@/components/ui/button';

import {
    Badge,
} from '@/components/ui/badge';
import {
    MoreVertical,
    FileText,
    ThumbsDown,
    Check,
    X,
    Trash,
    Edit,
    Star
} from 'lucide-react';

export default function CampainsTable({ isLoading, filteredCampaigns, setSelectedCampaign, setShowDeleteAlert, setFilterStatus, handleViewDetails, handleStatusUpdate, handleFeaturedUpdate, navigateToEditProject }) {
    return (<CardContent>
        {isLoading ? (
            <div className="flex justify-center py-10">Loading campaigns...</div>
        ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.category_detail.title}</TableCell>
                            <TableCell>${parseFloat(campaign.total_target).toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge className={campaign.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                    {campaign.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={campaign.is_featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                                    {campaign.is_featured ? "Featured" : "Not Featured"}
                                </Badge>
                            </TableCell>
                            <TableCell>{campaign.rating}</TableCell>
                            <TableCell>{new Date(campaign.end_time).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onClick={() => handleViewDetails(campaign.id)}
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            View Reports
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => navigateToEditProject(campaign.id)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Project
                                        </DropdownMenuItem>

                                        {campaign.is_active ? (
                                            <DropdownMenuItem
                                                onClick={() => handleStatusUpdate(campaign.id, false)}
                                                className="text-yellow-600"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Deactivate Campaign
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() => handleStatusUpdate(campaign.id, true)}
                                                className="text-green-600"
                                            >
                                                <Check className="mr-2 h-4 w-4" />
                                                Activate Campaign
                                            </DropdownMenuItem>
                                        )}

                                        {campaign.is_featured ? (
                                            <DropdownMenuItem
                                                onClick={() => handleFeaturedUpdate(campaign.id, false)}
                                                className="text-gray-600"
                                            >
                                                <ThumbsDown className="mr-2 h-4 w-4" />
                                                Unfeature Campaign
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() => handleFeaturedUpdate(campaign.id, true)}
                                                className="text-blue-600"
                                            >
                                                <Star className="mr-2 h-4 w-4" />
                                                Feature Campaign
                                            </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-500"
                                            onClick={() => {
                                                setSelectedCampaign(campaign);
                                                setShowDeleteAlert(true);
                                            }}
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Delete Campaign
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )}
    </CardContent>)
}