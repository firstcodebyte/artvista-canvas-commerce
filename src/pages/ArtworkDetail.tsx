
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getArtworkById, getRelatedArtworks } from '@/data/artworks';
import { formatPrice } from '@/utils/formatPrice';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Heart, Calendar, Ruler, Palette } from 'lucide-react';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  
  const artwork = id ? getArtworkById(id) : null;
  const relatedArtworks = id ? getRelatedArtworks(id) : [];
  
  if (!artwork) {
    return (
      <div className="section-container text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Artwork not found</h1>
        <p className="mb-6">The artwork you're looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/gallery">Browse Gallery</Link>
        </Button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (artwork.sold) {
      toast({
        title: "Artwork already sold",
        description: "This artwork is no longer available for purchase.",
        variant: "destructive",
      });
      return;
    }
    
    const { id, title, artistName, price, image } = artwork;
    const effectivePrice = artwork.discount || price;
    
    addItem({ id, title, artistName, price: effectivePrice, image });
    
    toast({
      title: "Added to Cart",
      description: `${title} has been added to your cart.`,
    });
  };
  
  const handleBuyNow = () => {
    if (artwork.sold) {
      toast({
        title: "Artwork already sold",
        description: "This artwork is no longer available for purchase.",
        variant: "destructive",
      });
      return;
    }
    
    const { id, title, artistName, price, image } = artwork;
    const effectivePrice = artwork.discount || price;
    
    addItem({ id, title, artistName, price: effectivePrice, image });
    navigate('/checkout');
  };
  
  const toggleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add this artwork to your favorites.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked 
        ? `${artwork.title} has been removed from your favorites.` 
        : `${artwork.title} has been added to your favorites.`,
    });
  };

  return (
    <div className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Artwork Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <img 
            src={artwork.image} 
            alt={artwork.title} 
            className="w-full h-auto object-cover" 
          />
        </div>
        
        {/* Artwork Details */}
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {artwork.title}
              </h1>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                onClick={toggleLike}
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <p className="text-lg text-gray-600">
              By <Link to={`/gallery?search=${artwork.artistName}`} className="text-artvista-purple hover:text-artvista-purple-dark">
                {artwork.artistName}
              </Link>
            </p>
          </div>
          
          {/* Price Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            {artwork.discount ? (
              <div className="mb-2">
                <span className="text-gray-400 line-through text-lg mr-2">
                  {formatPrice(artwork.price)}
                </span>
                <span className="text-2xl font-bold text-artvista-purple-dark">
                  {formatPrice(artwork.discount)}
                </span>
              </div>
            ) : (
              <div className="mb-2">
                <span className="text-2xl font-bold text-artvista-purple-dark">
                  {formatPrice(artwork.price)}
                </span>
              </div>
            )}
            
            {/* Artwork Status */}
            {artwork.sold ? (
              <Badge variant="destructive" className="mb-4">Sold</Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-4">Available</Badge>
            )}
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-artvista-purple hover:bg-artvista-purple-dark"
                onClick={handleAddToCart}
                disabled={artwork.sold}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-artvista-purple text-artvista-purple hover:bg-artvista-purple/10"
                onClick={handleBuyNow}
                disabled={artwork.sold}
              >
                Buy Now
              </Button>
            </div>
          </div>
          
          {/* Artwork Specifications */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Artwork Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Palette className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Medium</p>
                  <p className="font-medium">{artwork.medium}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Ruler className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium">{artwork.dimensions}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(artwork.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <Link to={`/gallery?category=${artwork.category}`}>
                  <Badge variant="outline" className="mt-1 hover:bg-gray-100">
                    {artwork.category}
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Artwork Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">About this artwork</h3>
            <p className="text-gray-600 mb-4">{artwork.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {artwork.tags.map((tag) => (
                <Link key={tag} to={`/gallery?search=${tag}`}>
                  <Badge variant="outline" className="hover:bg-gray-100">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Artworks */}
      {relatedArtworks.length > 0 && (
        <div className="border-t pt-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedArtworks.map((relatedArtwork) => (
              <Link 
                to={`/artwork/${relatedArtwork.id}`} 
                key={relatedArtwork.id} 
                className="art-card group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={relatedArtwork.image} 
                    alt={relatedArtwork.title} 
                    className="art-image" 
                  />
                  {relatedArtwork.sold && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Sold
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-artvista-purple transition-colors">
                    {relatedArtwork.title}
                  </h3>
                  <p className="text-gray-500 text-sm">by {relatedArtwork.artistName}</p>
                  <div className="mt-2">
                    <span className="text-artvista-purple-dark font-medium">
                      {formatPrice(relatedArtwork.discount || relatedArtwork.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;
