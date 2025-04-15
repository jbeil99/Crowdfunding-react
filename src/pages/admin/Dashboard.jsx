import { useState } from 'react';
import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';

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
    Input,
} from '@/components/ui/Input';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Search,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getCommentsReported, getProjects, getProject, deleteProject, updateCampaignFeatured, cancelProject, getProjectReports, updateCampaignAccepted } from '../../lib/projects';
import { getUsers } from '../../lib/profile';
import StateOverview from './components/StateOverview';
import CampaignTab from './components/CampaignTab';
import UsersTab from './components/UsersTab';
import CommentsTab from './components/CommentsTab';
import CampaignDetail from './components/campaignDetail';
import { toast } from 'sonner';

// Dashboard Component
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [count, setCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [reports, setReports] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState(null);


    const fetchData = async (url) => {
        setIsLoading(true);
        try {
            const [campaigns, users, comments] = await Promise.all([
                getProjects(url),
                getUsers(),
                getCommentsReported(),
            ]);

            const data = campaigns.data;
            setCampaigns((prev) => {
                // Check if this is a pagination request (url exists)
                if (url) {
                    // Append new results to existing data
                    return [...prev, ...data.results];
                } else {
                    // Initial load - just set the results
                    return data.results;
                }
            });
            setStatistics(campaigns.data.statistics)
            setCount(data.count);
            setUsers(users.data.results);
            setComments(comments.data.results);
            setNextPageUrl(data.next);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Something went wrong while fetching data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLoadMore = () => {
        if (nextPageUrl) {
            setIsLoading(true);
            fetchData(nextPageUrl);
        }
    }


    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "approved" && campaign.is_active) ||
            (filterStatus === "pending" && !campaign.is_active);
        return matchesSearch && matchesStatus;
    });

    const deleteCampaign = async () => {
        try {
            const response = await deleteProject(selectedCampaign.id);
            if (response.status === 200) {
                toast.success('Campaign deleted successfully');
            } else {
                toast.error('Failed to delete campaign:', response.statusText);
            }
            if (response.data) {
                setCampaigns(campaigns.filter(campaign => campaign.id !== response.data.id));
                setComments(comments.filter(comment => comment.campaignId !== response.data.id));
                setShowDeleteAlert(false);
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
        }
    };

    const handleViewDetails = async (id) => {
        console.log(id)
        setIsLoadingDetails(true);
        try {
            const [campaign, reports] = await Promise.all([
                getProject(id),
                getProjectReports(id),
            ]);

            if (campaign.status === 200) {
                setSelectedCampaign(campaign.data);
                setReports(reports.data.results);
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
            const response = await cancelProject(campaignId, newStatus);
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

    const handleFeaturedUpdate = async (campaignId, isFeatured) => {
        try {
            const response = await updateCampaignFeatured(campaignId, isFeatured);
            if (response.status === 200) {
                setCampaigns(campaigns.map(campaign =>
                    campaign.id === campaignId
                        ? { ...campaign, is_featured: isFeatured }
                        : campaign
                ));
            }
        } catch (error) {
            console.error('Failed to update campaign featured status:', error);
        }
    };
    const handleAcceptUpdate = async (campaignId, isAcceped) => {
        try {
            const response = await updateCampaignAccepted(campaignId, isAcceped);
            if (response.status === 200) {
                setCampaigns(campaigns.map(campaign =>
                    campaign.id === campaignId
                        ? { ...campaign, is_accepted: isAcceped }
                        : campaign
                ));
            }
        } catch (error) {
            console.error('Failed to update campaign featured status:', error);
        }
    };

    const navigateToEditProject = (projectId) => {
        navigate(`/projects/edit/${projectId}`);
    };

    // Campaign Statistics

    // Count campaigns by category
    const campaignsByCategory = campaigns.reduce((acc, campaign) => {
        const category = campaign.category_detail?.title || 'Unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

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
                <StateOverview campaigns={campaigns} count={count} statistics={statistics} />

                {/* Main Tabs */}
                <Tabs defaultValue="campaigns" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="reported">Reported Comments</TabsTrigger>
                    </TabsList>

                    {/* Campaigns Tab */}
                    <CampaignTab
                        isLoading={isLoading}
                        filteredCampaigns={filteredCampaigns}
                        setSelectedCampaign={setSelectedCampaign}
                        setShowDeleteAlert={setShowDeleteAlert}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        handleViewDetails={handleViewDetails}
                        handleStatusUpdate={handleStatusUpdate}
                        handleFeaturedUpdate={handleFeaturedUpdate}
                        navigateToEditProject={navigateToEditProject}
                        handleLoadMore={handleLoadMore}
                        nextPageUrl={nextPageUrl}
                        handleAcceptUpdate={handleAcceptUpdate}
                    />

                    {/* Users Tab */}
                    <UsersTab users={users} />

                    {/* Reported Comments Tab */}
                    <CommentsTab comments={comments} />


                </Tabs>
            </main>


            <CampaignDetail selectedCampaign={selectedCampaign} showDetailsDialog={showDetailsDialog} setShowDetailsDialog={setShowDetailsDialog} reports={reports} />
            {/* Delete Alert Dialog */}
            < AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert} >
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
            </AlertDialog >
        </div >
    );
}