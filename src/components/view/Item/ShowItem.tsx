'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, MapPin, Utensils, Loader2 } from 'lucide-react';

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, Input, Button, Badge, Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';

import { ItemPresenter, ItemView } from '@/presenters/ItemPresenter';
import { Item } from '@/types/item';
import { formatItemNameForUrl } from '@/utils/urlFormatter';

interface ShowItemProps {
  title?: string;
  showBreadcrumb?: boolean;
}

export default function ShowItem({ title = 'Kategori' }: ShowItemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNation, setSelectedNation] = useState<string>('all');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const itemView: ItemView = {
    showLoading: (loading: boolean) => setLoading(loading),
    showSuccess: (message: string) => {
      console.log('Success:', message);
    },
    showError: (message: string) => setError(message),
    setItems: (items: Item[]) => setItems(items),
    setItem: () => {},
  };

  const [itemPresenter] = useState(() => new ItemPresenter(itemView));

  const fetchItems = useCallback(async () => {
    try {
      setError('');
      await itemPresenter.getAllItems();
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  }, [itemPresenter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    return ['all', ...uniqueCategories];
  }, [items]);

  const nations = useMemo(() => {
    const uniqueNations = [...new Set(items.map((item) => item.nation))];
    return ['all', ...uniqueNations];
  }, [items]);

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

  return (
    <div className="container mx-auto px-4 py-10 lg:py-20">
      <main className="mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href="/" className="text-orange-600 hover:text-orange-700">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{title}</h1>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-red-600">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchItems} className="text-red-600 border-red-200">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
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
            </Select>

            {(selectedCategory !== 'all' || selectedNation !== 'all' || searchTerm) && (
              <Button variant="outline" onClick={clearFilters} className="border-2 border-gray-200 hover:border-orange-400">
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
              <h3 className="text-xl font-semibold mb-2">Loading items...</h3>
              <p className="text-gray-600">Please wait while we fetch the latest food items.</p>
            </CardContent>
          </Card>
        )}

        {/* Food Grid */}
        {!loading && filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((food) => (
              <Card key={food._id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Food Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image src={food.image || '/placeholder.svg'} alt={food.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Nation Badge */}
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

                  {/* View Details Button */}
                  <Link href={`/item/${formatItemNameForUrl(food.name)}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-lg h-11 font-medium transition-all duration-200 transform hover:scale-105">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && filteredItems.length === 0 && items.length > 0 ? (
          /* No Results */
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="text-gray-300 text-8xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold mb-3">Makanan tidak ditemukan</h3>
              <p className="text-gray-600 mb-6">Tidak ada makanan yang sesuai dengan filter yang dipilih.</p>
              <Button onClick={clearFilters} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : !loading && items.length === 0 && !error ? (
          /* No Items Available */
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="text-gray-300 text-8xl mb-6">📭</div>
              <h3 className="text-2xl font-bold mb-3">No items available</h3>
              <p className="text-gray-600 mb-6">There are currently no food items available in the database.</p>
              <Button onClick={fetchItems} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
