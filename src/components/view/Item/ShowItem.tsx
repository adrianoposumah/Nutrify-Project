'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, MapPin, Loader2 } from 'lucide-react';

import {
  Input,
  Button,
  Badge,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components';

import { ItemPresenter, ItemView } from '@/presenters/ItemPresenter';
import { Item } from '@/types/item';
import { formatItemNameForUrl } from '@/utils/urlFormatter';

const NATIONS = ['Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Philippines', 'China', 'Japan', 'Korea', 'India', 'Italy', 'France', 'Mexico', 'USA'];

const CATEGORIES = ['food', 'beverage', 'dessert', 'appetizer', 'main course', 'side dish'];

export default function ShowItem() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNation, setSelectedNation] = useState<string>('all');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  }>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  });
  const itemView: ItemView = {
    showLoading: (loading: boolean) => setLoading(loading),
    showSuccess: (message: string) => {
      console.log('Success:', message);
    },
    showError: (message: string) => setError(message),
    setItems: (items: Item[]) => setItems(items),
    setItem: () => {},
    setPagination: (paginationData) => setPagination(paginationData),
  };

  const [itemPresenter] = useState(() => new ItemPresenter(itemView));
  const fetchItems = useCallback(
    async (page: number = 1) => {
      try {
        setError('');
        await itemPresenter.getAllItems(page, 20);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    },
    [itemPresenter]
  );
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = useMemo(() => {
    return ['all', ...CATEGORIES];
  }, []);

  const nations = useMemo(() => {
    return ['all', ...NATIONS];
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesNation = selectedNation === 'all' || item.nation === selectedNation;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesNation && matchesSearch;
    });
  }, [items, selectedCategory, selectedNation, searchTerm]);
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedNation('all');
    setSearchTerm('');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchItems(page);
    }
  };
  const renderPaginationItems = () => {
    const items = [];
    const { currentPage: paginationCurrentPage, totalPages } = pagination; // Always show first page
    if (paginationCurrentPage > 3) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer transition-colors hover:bg-orange-50 hover:text-orange-600">
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (paginationCurrentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    const start = Math.max(1, paginationCurrentPage - 1);
    const end = Math.min(totalPages, paginationCurrentPage + 1);
    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === paginationCurrentPage}
            className={`cursor-pointer transition-colors ${i === paginationCurrentPage ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600' : 'hover:bg-orange-50 hover:text-orange-600'}`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (paginationCurrentPage < totalPages - 2) {
      if (paginationCurrentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer transition-colors hover:bg-orange-50 hover:text-orange-600">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>{' '}
              <Button variant="outline" size="sm" onClick={() => fetchItems(pagination.currentPage)} className="text-red-600 border-red-200">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-6 mb-5">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input type="text" placeholder="Search foods, nations, or origins..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12 border-2 border-gray-200 focus:border-orange-400 rounded-xl" />
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-orange-400 rounded-lg">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedNation} onValueChange={setSelectedNation}>
            <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-orange-400 rounded-lg">
              <SelectValue placeholder="Select nation" />
            </SelectTrigger>
            <SelectContent>
              {nations.map((nation) => (
                <SelectItem key={nation} value={nation}>
                  {nation === 'all' ? 'All Nations' : nation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{' '}
          {(selectedCategory !== 'all' || selectedNation !== 'all' || searchTerm) && (
            <Button
              variant="outline"
              onClick={() => {
                clearFilters();
                fetchItems(1);
              }}
              className="border-2 border-gray-200 hover:border-orange-400"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {/* Loading State */}
      {loading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2">Memuat item...</h3>
            <p className="text-gray-600">Mohon tunggu sebentar.</p>
          </CardContent>
        </Card>
      )}
      {!loading && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((food) => (
            <Card key={food._id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <Image src={food.image || '/placeholder.svg'} alt={food.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 right-3">
                  <Badge className="border-0 shadow-md">
                    <MapPin className="w-3 h-3 mr-1" />
                    {food.nation}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{food.name}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-0">
                      {food.category}
                    </Badge>
                  </div>

                  {food.origin && (
                    <p className="text-sm mb-3">
                      <span className="font-medium">Origin:</span> {food.origin}
                    </p>
                  )}
                </div>
                <p className="text-sm line-clamp-2 leading-relaxed">{food.description}</p>

                <Link href={`/item/${formatItemNameForUrl(food.name)}`} className="block">
                  <Button className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-lg h-11 font-medium transition-all duration-200 transform hover:scale-105">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !loading && filteredItems.length === 0 && items.length > 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">🍽️</div>
            <h3 className="text-2xl font-bold mb-3">Makanan tidak ditemukan</h3>
            <p className="text-gray-600 mb-6">Tidak ada makanan yang sesuai dengan filter yang dipilih.</p>{' '}
            <Button
              onClick={() => {
                clearFilters();
                fetchItems(1);
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : !loading && items.length === 0 && !error ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16">
            <div className="text-gray-300 text-8xl mb-6">🍽</div>
            <h3 className="text-2xl font-bold mb-3">Tidak ada Item Ditemukan</h3>
            <p className="text-gray-600 mb-6">Tidak ada item yang didapat dari Database.</p>
            <Button onClick={() => fetchItems(1)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : null}{' '}
      {/* Pagination */}
      {!loading && filteredItems.length > 0 && pagination.totalPages > 1 && selectedCategory === 'all' && selectedNation === 'all' && !searchTerm && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className={`${pagination.currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-orange-50 hover:text-orange-600'} transition-colors`}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className={`${pagination.currentPage >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-orange-50 hover:text-orange-600'} transition-colors`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {/* Pagination Info */}
      {!loading && filteredItems.length > 0 && selectedCategory === 'all' && selectedNation === 'all' && !searchTerm && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} items
        </div>
      )}
      {/* Filter Info */}
      {!loading && (selectedCategory !== 'all' || selectedNation !== 'all' || searchTerm) && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Showing {filteredItems.length} filtered results from page {pagination.currentPage}
        </div>
      )}
    </div>
  );
}
