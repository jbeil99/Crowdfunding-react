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


export default function UsersTab({ users }) {
    return (
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
    )
}