'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Check, X, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Label, Textarea, Skeleton, PendingItemDetail } from '@/components';
import { PendingItemPresenter, PendingItemView } from '@/presenters/PendingItemPresenter';
import { PendingItem } from '@/types';

interface PendingItemListProps {
  onRefresh?: () => void;
}

export default function PendingItemList({ onRefresh }: PendingItemListProps) {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Presenter view implementation
  const pendingItemView: PendingItemView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => {
      toast.success(message);
    },
    showError: (message: string) => {
      toast.error(message);
    },
    setPendingItems: (items: PendingItem[]) => setPendingItems(items),
    setPendingItem: (item: PendingItem | null) => setSelectedItem(item),
    refreshData: () => {
      fetchPendingItems();
      if (onRefresh) onRefresh();
    },
    closeDialog: () => {
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    },
  };

  const [pendingItemPresenter] = useState(() => new PendingItemPresenter(pendingItemView));

  const fetchPendingItems = async () => {
    await pendingItemPresenter.getAllPendingItems();
  };

  const handleViewDetail = async (item: PendingItem) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);

    // Fetch detailed data
    await pendingItemPresenter.getPendingItemDetail(item.pendingId);
  };

  const handleApprove = async (item: PendingItem) => {
    setActionLoading(true);
    const success = await pendingItemPresenter.approvePendingItem(item.pendingId);
    setActionLoading(false);

    if (success) {
      setIsDetailDialogOpen(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedItem) return;

    setActionLoading(true);
    const success = await pendingItemPresenter.rejectPendingItem(selectedItem.pendingId, rejectionReason.trim() || undefined);
    setActionLoading(false);

    if (success) {
      setIsDetailDialogOpen(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  useEffect(() => {
    const initializePendingItems = async () => {
      await pendingItemPresenter.getAllPendingItems();
    };
    initializePendingItems();
  }, [pendingItemPresenter]);
  if (isLoading && pendingItems.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Image Skeleton */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Skeleton className="w-full md:w-[180px] h-48 md:h-[180px] rounded-lg" />
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Title */}
                      <Skeleton className="h-6 w-3/4" />

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>

                      {/* Date */}
                      <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-8 w-16 flex-1 md:flex-none" />
                      <Skeleton className="h-8 w-20 flex-1 md:flex-none" />
                      <Skeleton className="h-8 w-16 flex-1 md:flex-none" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pendingItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Tidak ada Request Makanan.</p>
      </div>
    );
  }

  return (
    <>
      {' '}
      <div className="space-y-4">
        {pendingItems.map((item) => (
          <Card key={item.pendingId} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Image */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Image src={item.image || '/placeholder.svg'} alt={item.name} width={180} height={180} className="w-full md:w-[180px] h-48 md:h-[180px] rounded-lg object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{item.nation || item.origin}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(item.submittedAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetail(item)} className="flex items-center gap-1 flex-1 md:flex-none">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="default" size="sm" onClick={() => handleApprove(item)} disabled={actionLoading} className="flex items-center gap-1 flex-1 md:flex-none">
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Approve
                      </Button>{' '}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsRejectDialogOpen(true);
                        }}
                        disabled={actionLoading}
                        className="flex items-center gap-1 flex-1 md:flex-none"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>{' '}
      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-[95vw] max-w-5xl sm:max-w-5xl md:max-w-5xl lg:max-w-5xl xl:max-w-5xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
          {selectedItem ? (
            <>
              <PendingItemDetail selectedItem={selectedItem} />{' '}
              <DialogFooter className="mt-6">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)} className="w-full sm:w-auto">
                    Close
                  </Button>
                  <Button variant="default" onClick={() => selectedItem && handleApprove(selectedItem)} disabled={actionLoading || !selectedItem} className="flex items-center gap-1 w-full sm:w-auto">
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      setIsRejectDialogOpen(true);
                    }}
                    disabled={actionLoading}
                    className="flex items-center gap-1 w-full sm:w-auto"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="p-4 sm:p-6 space-y-6">
              <DialogHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </DialogHeader>{' '}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Image and nutrition skeleton - Top on mobile, right on desktop */}
                <div className="order-1 lg:order-2 col-span-full lg:col-span-3 space-y-6">
                  <Skeleton className="w-full h-[300px] rounded-lg" />

                  {/* Nutrition skeleton */}
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content skeleton - Bottom on mobile, left on desktop */}
                <div className="order-2 lg:order-1 col-span-full lg:col-span-4 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>{' '}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
                <Skeleton className="h-9 w-full sm:w-16" />
                <Skeleton className="h-9 w-full sm:w-20" />
                <Skeleton className="h-9 w-full sm:w-16" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Reject Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Item</DialogTitle>
            <DialogDescription>Are you sure you want to reject this item? You can provide a reason below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
              <Textarea id="rejection-reason" placeholder="Enter reason for rejection..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} />
            </div>
          </div>{' '}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason('');
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm} disabled={actionLoading} className="flex items-center gap-1 w-full sm:w-auto">
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              Reject Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
