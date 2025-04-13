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
import { getMemberSince } from '../../../lib/helpers';

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
                                <TableHead>Join Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getMemberSince(user.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
    )
}