
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { artworks, getCategories } from '@/data/artworks';
import { formatPrice } from '@/utils/formatPrice';

const Index = () => {
  const featuredArtworks = artworks.slice(0, 4);
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05)',
            filter: 'brightness(0.6)'
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Discover the Finest Indian Artworks
          </h1>
          <p className="text-xl text-white mb-8">
            ArtVista showcases exceptional creations from talented Indian artists, connecting art lovers with unique pieces that inspire and evoke emotions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-artvista-purple hover:bg-artvista-purple-dark text-white"
            >
              <Link to="/gallery">Explore Gallery</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="bg-white/90 hover:bg-white text-artvista-purple-dark border-artvista-purple-dark"
            >
              <Link to="/signup">Join as Artist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="section-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Featured Artworks</h2>
          <Link 
            to="/gallery" 
            className="text-artvista-purple hover:text-artvista-purple-dark underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtworks.map((artwork) => (
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
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="section-container">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Explore by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category} 
                to={`/gallery?category=${category}`}
                className="relative h-40 rounded-lg overflow-hidden group"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${artworks.find(a => a.category === category)?.image})`,
                    filter: 'brightness(0.7)'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white font-serif font-medium text-xl">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Showcase */}
      <section className="section-container">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
          Why Choose ArtVista?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-artvista-purple-light text-artvista-purple-dark flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Authentic Artwork</h3>
            <p className="text-gray-600">
              All artworks are verified and authenticated, coming directly from talented Indian artists.
            </p>
          </div>

          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-artvista-purple-light text-artvista-purple-dark flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Secure Delivery</h3>
            <p className="text-gray-600">
              We ensure safe packaging and reliable shipping of artwork to your doorstep.
            </p>
          </div>

          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-artvista-purple-light text-artvista-purple-dark flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Trusted payment options including Razorpay, UPI, and all major credit/debit cards.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-artvista-purple-dark text-white py-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Start Your Art Collection?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of art enthusiasts who have found their perfect piece through ArtVista.
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-white text-artvista-purple-dark hover:bg-gray-100"
          >
            <Link to="/gallery">Browse Artworks</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
