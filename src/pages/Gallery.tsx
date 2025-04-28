
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Slider 
} from '@/components/ui/slider';
import { Search, FilterX } from 'lucide-react';
import { artworks, getCategories } from '@/data/artworks';
import { formatPrice } from '@/utils/formatPrice';
import { Artwork } from '@/data/artworks';

const Gallery = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOption, setSortOption] = useState('newest');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(artworks);
  
  const categories = ['All', ...getCategories()];

  // Filter artworks based on search query, category, and price range
  useEffect(() => {
    let filtered = [...artworks];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(query) ||
          artwork.artistName.toLowerCase().includes(query) ||
          artwork.description.toLowerCase().includes(query) ||
          artwork.category.toLowerCase().includes(query) ||
          artwork.tags.some((tag) => tag.includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((artwork) => artwork.category === selectedCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(
      (artwork) => {
        const effectivePrice = artwork.discount || artwork.price;
        return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
      }
    );
    
    // Sort the filtered artworks
    switch (sortOption) {
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low-high':
        filtered = filtered.sort((a, b) => (a.discount || a.price) - (b.discount || b.price));
        break;
      case 'price-high-low':
        filtered = filtered.sort((a, b) => (b.discount || b.price) - (a.discount || a.price));
        break;
      default:
        break;
    }
    
    setFilteredArtworks(filtered);
  }, [searchQuery, selectedCategory, priceRange, sortOption]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 50000]);
    setSortOption('newest');
  };

  return (
    <div className="section-container">
      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">
        Artwork Gallery
      </h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search artworks by title, artist, or keyword..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-64">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Button */}
          <Button 
            variant="outline" 
            className="md:self-start"
            onClick={resetFilters}
          >
            <FilterX className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === category 
                      ? "bg-artvista-purple hover:bg-artvista-purple-dark" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <span className="text-sm text-gray-500">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </span>
            </div>
            <Slider
              defaultValue={[0, 50000]}
              max={50000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'}
        </p>
      </div>

      {/* Artworks Grid */}
      {filteredArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork) => (
            <Link 
              to={`/artwork/${artwork.id}`} 
              key={artwork.id} 
              className="art-card group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={artwork.image} 
                  alt={artwork.title} 
                  className="art-image" 
                />
                {artwork.sold && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Sold
                  </div>
                )}
                {artwork.discount && (
                  <div className="absolute top-2 left-2 bg-artvista-purple text-white px-2 py-1 rounded text-xs font-medium">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-artvista-purple transition-colors">
                  {artwork.title}
                </h3>
                <p className="text-gray-500 text-sm">by {artwork.artistName}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    {artwork.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(artwork.price)}
                        </span>
                        <span className="text-artvista-purple-dark font-medium">
                          {formatPrice(artwork.discount)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-artvista-purple-dark font-medium">
                        {formatPrice(artwork.price)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{artwork.medium}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No artworks found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse all available artworks.
          </p>
          <Button onClick={resetFilters}>
            View All Artworks
          </Button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
