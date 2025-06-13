'use client';

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, UserCog, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AdminPresenter, AdminView } from '@/presenters/AdminPresenter';
import { AdminUser, Pagination } from '@/types/admin';
import toast from 'react-hot-toast';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
interface UserTableProps {
  className?: string;
}

export default function UserTable({ className }: UserTableProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Create view object for presenter
  const view: AdminView = {
    users,
    pagination,
    loading,
    error,
    setUsers,
    setPagination,
    setLoading,
    setError,
  };
  const [presenter] = useState(() => new AdminPresenter(view));
  const loadUsers = async (page?: number) => {
    await presenter.getUsers({
      page: page || pagination.currentPage,
      limit: pagination.limit,
    });
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      setPagination({ ...pagination, currentPage: newPage });
      await loadUsers(newPage);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRoleChange = async (userId: string, newRole: string) => {
    const loadingToast = toast.loading('Updating user role...');

    try {
      const result = await presenter.changeUserRole(userId, newRole);
      if (result.success) {
        toast.success('User role updated successfully!', { id: loadingToast });
      } else {
        toast.error('Failed to update user role', { id: loadingToast });
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('An error occurred while updating user role', { id: loadingToast });
    }
  };
  const handleDeleteUser = async (userId: string) => {
    const loadingToast = toast.loading('Deleting user...');

    try {
      const success = await presenter.deleteUser(userId);
      if (success) {
        toast.success('User deleted successfully!', { id: loadingToast });
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      } else {
        toast.error('Failed to delete user', { id: loadingToast });
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('An error occurred while deleting user', { id: loadingToast });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (isVerified: boolean) => {
    return <Badge variant={isVerified ? 'default' : 'normal'}>{isVerified ? 'Verified' : 'Not Verified'}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, 'default' | 'normal' | 'destructive' | 'outline'> = {
      admin: 'destructive',
      moderator: 'default',
      user: 'outline',
    };
    return <Badge variant={roleColors[role.toLowerCase()] || 'outline'}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
  };
  if (loading && (!users || users.length === 0)) {
    return (
      <div className={`rounded-md border ${className || ''}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>{' '}
          <TableBody>
            {!users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.isVerified)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={loading}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(user.userId, 'admin')} disabled={user.role === 'admin'}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.userId, 'moderator')} disabled={user.role === 'moderator'}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Make Moderator
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.userId, 'user')} disabled={user.role === 'user'}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Make User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>{' '}
      {/* Pagination Controls */}
      {pagination.totalItems > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} users
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={pagination.currentPage === 1 || loading}>
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1 || loading}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm text-muted-foreground px-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages || loading}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.currentPage === pagination.totalPages || loading}>
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}{' '}
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure you want to delete user &quot;{selectedUser?.name}&quot;? This action cannot be undone.</DialogDescription>
          </DialogHeader>{' '}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => selectedUser && handleDeleteUser(selectedUser.userId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
