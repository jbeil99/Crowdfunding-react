import {
    Card,
    CardContent,

    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {

    TabsContent,

} from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function CommentsTab({ comments }) {
    return (
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
    )
}