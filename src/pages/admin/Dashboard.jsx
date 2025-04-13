import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    Button,
} from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Input,
} from '@/components/ui/Input';
import {
    Badge,
} from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BarChart,
    DollarSign,
    MoreVertical,
    Search,
    Users,
    FileText,
    ThumbsUp,
    Check,
    X,
    Trash
} from 'lucide-react';



import { useEffect } from 'react';
import { getCommentsReported, getProjects, getProject, updateCampaignStatus } from '../../lib/projects';
import { getUsers } from '../../lib/profile';

// Dashboard Component
export default function AdminDashboard() {
    const [campaigns, setCampaigns] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isLoading, setIsLoading] = useState("all");
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [campaigns, users, comments] = await Promise.all([
                    getProjects(),
                    getUsers(),
                    getCommentsReported(),
                ]);

                if (campaigns.status !== 200 || users.status !== 200 || comments.status !== 200) {
                    throw new Error('Failed to fetch data');
                }

                setCampaigns(campaigns.data.results);
                setUsers(users.data.results);
                setComments(comments.data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    // Filter campaigns based on search and status filter
    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "approved" && campaign.is_active) ||
            (filterStatus === "pending" && !campaign.is_active);
        return matchesSearch && matchesStatus;
    });

    // Handle campaign approval
    const approveCampaign = (id) => {
        setCampaigns(campaigns.map(campaign =>
            campaign.id === id ? { ...campaign, status: "approved" } : campaign
        ));
    };

    // Handle campaign deletion
    const deleteCampaign = () => {
        if (selectedCampaign) {
            setCampaigns(campaigns.filter(campaign => campaign.id !== selectedCampaign.id));
            setComments(comments.filter(comment => comment.campaignId !== selectedCampaign.id));
            setShowDeleteAlert(false);
        }
    };

    const handleViewDetails = async (campaign) => {
        setIsLoadingDetails(true);
        try {
            const response = await getProject(campaign.id);
            if (response.status === 200) {
                setSelectedCampaign(response.data);
            } else {
                console.error('Failed to fetch campaign details');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoadingDetails(false);
            setShowDetailsDialog(true);
        }
    };

    const handleStatusUpdate = async (campaignId, newStatus) => {
        try {
            const response = await updateCampaignStatus(campaignId, newStatus);
            if (response.status === 200) {
                setCampaigns(campaigns.map(campaign =>
                    campaign.id === campaignId
                        ? { ...campaign, is_active: newStatus }
                        : campaign
                ));
            }
        } catch (error) {
            console.error('Failed to update campaign status:', error);
        }
    };

    // Campaign Statistics
    const totalCampaigns = campaigns.length;
    const pendingCampaigns = campaigns.filter(c => !c.is_active).length;
    const approvedCampaigns = campaigns.filter(c => c.is_active).length;
    const totalRaised = campaigns.reduce((sum, campaign) => sum + (campaign.total_donations || 0), 0);
    const totalBackers = campaigns.length; // Since backers count isn't provided in the data







    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Crowdfunding Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                            <Search className="h-4 w-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="border-0 bg-transparent focus:outline-none focus:ring-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Avatar>
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Stats Overview */}
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
                                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                                <p className="text-2xl font-bold">{pendingCampaigns}</p>
                            </div>
                            <ThumbsUp className="h-8 w-8 text-yellow-500" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between pt-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Raised</p>
                                <p className="text-2xl font-bold">${totalRaised.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between pt-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Backers</p>
                                <p className="text-2xl font-bold">{totalBackers}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-500" />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="campaigns" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="reported">Reported Comments</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>

                    {/* Campaigns Tab */}
                    <TabsContent value="campaigns">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Campaigns Management</CardTitle>
                                    <div className="flex gap-2">
                                        <select
                                            className="border rounded px-2 py-1 text-sm"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                        </select>
                                    </div>
                                </div>
                            </CardHeader>
                            {/* Campaigns Table */}
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Creator</TableHead>
                                            <TableHead>Target</TableHead>
                                            <TableHead>Raised</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCampaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell className="font-medium">{campaign.title}</TableCell>
                                                <TableCell>{campaign.user}</TableCell>
                                                <TableCell>${parseFloat(campaign.total_target).toLocaleString()}</TableCell>
                                                <TableCell>${(campaign.total_donations || 0).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge className={campaign.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                                        {campaign.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
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
                                                                onClick={() => handleViewDetails(campaign)}
                                                            >
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                View Details
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
                            </CardContent>

                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>Users Management</CardTitle>
                            </CardHeader>
                            {/* Users Table */}
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Campaigns Created</TableHead>
                                            <TableHead>Campaigns Backed</TableHead>
                                            <TableHead>Total Donated</TableHead>
                                            <TableHead>Join Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.campaigns}</TableCell>
                                                <TableCell>{user.backed}</TableCell>
                                                <TableCell>${user.totalDonated}</TableCell>
                                                <TableCell>{user.joinDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments">
                        <Card>
                            <CardHeader>
                                <CardTitle>Campaign Comments</CardTitle>
                            </CardHeader>
                            {/* Reported Comments Table */}
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campaign</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Comment</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {comments.map((comment) => {
                                            const campaign = campaigns.find(c => c.id === comment.campaignId);
                                            return (
                                                <TableRow key={comment.id}>
                                                    <TableCell className="font-medium">{campaign ? campaign.title : "Unknown Campaign"}</TableCell>
                                                    <TableCell>{comment.user}</TableCell>
                                                    <TableCell>{comment.comment}</TableCell>
                                                    <TableCell>{comment.date}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reported Comments Tab */}
                    <TabsContent value="reported">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reported Comments</CardTitle>
                            </CardHeader>
                            {/* Reported Comments Table */}
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Comment ID</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {comments.map((comment) => (
                                            <TableRow key={comment.id}>
                                                <TableCell className="font-medium">{comment.comment}</TableCell>
                                                <TableCell>{comment.details}</TableCell>
                                                <TableCell>{new Date(comment.created_at).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reports Tab */}
                    <TabsContent value="reports">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Campaign Performance</CardTitle>
                                    <CardDescription>Funding progress across campaigns</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {campaigns.map((campaign) => {
                                            const totalDonations = campaign.total_donations || 0;
                                            const target = parseFloat(campaign.total_target);
                                            const progressPercent = Math.min(100, Math.round((totalDonations / target) * 100)) || 0;

                                            return (
                                                <div key={campaign.id} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span>{campaign.title}</span>
                                                        <span className="font-medium">{progressPercent}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>${totalDonations.toLocaleString()} raised</span>
                                                        <span>Goal: ${target.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Campaign Status Summary</CardTitle>
                                    <CardDescription>Overview of campaign statuses</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center h-64">
                                    <div className="flex gap-8 mt-4">
                                        <div className="flex flex-col items-center">
                                            <div className="text-5xl font-bold text-yellow-500">{pendingCampaigns}</div>
                                            <div className="text-gray-500 mt-2">Pending</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="text-5xl font-bold text-green-500">{approvedCampaigns}</div>
                                            <div className="text-gray-500 mt-2">Approved</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="text-5xl font-bold text-blue-500">{totalCampaigns}</div>
                                            <div className="text-gray-500 mt-2">Total</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Campaign Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                {selectedCampaign && (
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{selectedCampaign.title}</DialogTitle>
                            <DialogDescription>Campaign ID: {selectedCampaign.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Creator</h4>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={selectedCampaign.owner.profile_picture}
                                            alt={selectedCampaign.owner.username}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">{selectedCampaign.owner.first_name} {selectedCampaign.owner.last_name}</p>
                                            <p className="text-xs text-gray-500">@{selectedCampaign.owner.username}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <Badge className={selectedCampaign.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                        {selectedCampaign.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Timeline</h4>
                                    <p className="text-sm">
                                        {new Date(selectedCampaign.start_time).toLocaleDateString()} -
                                        {new Date(selectedCampaign.end_time).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Progress</h4>
                                    <p className="text-sm">
                                        ${selectedCampaign.total_donations?.toLocaleString()} of ${parseFloat(selectedCampaign.total_target).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Images</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {selectedCampaign.images?.map((image) => (
                                        <img
                                            key={image.id}
                                            src={image.image_url}
                                            alt={image.title || 'Campaign image'}
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Details</h4>
                                <p className="text-sm text-gray-600">{selectedCampaign.details}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                                <div className="flex gap-2">
                                    {selectedCampaign.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex justify-between sm:justify-between">
                            {selectedCampaign.is_active ? (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        handleStatusUpdate(selectedCampaign.id, false);
                                        setShowDetailsDialog(false);
                                    }}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Deactivate Campaign
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        handleStatusUpdate(selectedCampaign.id, true);
                                        setShowDetailsDialog(false);
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Activate Campaign
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setShowDetailsDialog(false);
                                    setShowDeleteAlert(true);
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Campaign
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the campaign "{selectedCampaign?.title}" and all associated data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteCampaign}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}