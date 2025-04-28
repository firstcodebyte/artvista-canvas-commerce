
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/formatPrice';
import { artworks } from '@/data/artworks';

const ArtistDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state for adding new artwork
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    medium: '',
    dimensions: '',
    category: '',
    tags: '',
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate adding artwork
    toast({
      title: 'Artwork Added',
      description: `${formData.title} has been successfully added to your portfolio.`,
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      medium: '',
      dimensions: '',
      category: '',
      tags: '',
    });
  };
  
  // Filter artworks for this artist
  const artistArtworks = user?.id
    ? artworks.filter((artwork) => artwork.artistId === user.id)
    : [];
  
  // Filter sold artworks
  const soldArtworks = artistArtworks.filter((artwork) => artwork.sold);
  
  // Simulate sales data
  const totalSales = soldArtworks.reduce((sum, artwork) => sum + artwork.price, 0);
  const salesData = {
    totalAmount: totalSales,
    artworksSold: soldArtworks.length,
    pendingOrders: 2,
  };
  
  // Sample notifications
  const notifications = [
    {
      id: '1',
      message: 'Your artwork "Golden Temple Reflections" has been sold!',
      date: '2023-04-25',
      read: false,
    },
    {
      id: '2',
      message: 'New comment on your artwork "Cosmic Connections"',
      date: '2023-04-20',
      read: true,
    },
    {
      id: '3',
      message: 'Your artwork "Urban Symphony" has been featured on the homepage!',
      date: '2023-04-15',
      read: true,
    },
  ];
  
  // Redirect if not authenticated or not an artist
  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'artist') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!user || user.role !== 'artist') {
    return null;
  }
  
  return (
    <div className="section-container">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Artist Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}!</p>
      
      {/* Dashboard Overview */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {formatPrice(salesData.totalAmount)}
            </div>
            <p className="text-sm text-gray-500">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Artworks Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {salesData.artworksSold}
            </div>
            <p className="text-sm text-gray-500">Out of {artistArtworks.length} total artworks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-artvista-purple-dark">
              {salesData.pendingOrders}
            </div>
            <p className="text-sm text-gray-500">Orders awaiting shipment</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="add-artwork">Add Artwork</TabsTrigger>
          <TabsTrigger value="sales">Sales & Orders</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* Portfolio Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>My Artworks</CardTitle>
              <CardDescription>Manage your portfolio of artworks</CardDescription>
            </CardHeader>
            <CardContent>
              {artistArtworks.length > 0 ? (
                <div className="space-y-4">
                  {artistArtworks.map((artwork) => (
                    <div key={artwork.id} className="border rounded-lg p-4 flex gap-4">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title} 
                        className="w-24 h-24 object-cover rounded-md" 
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{artwork.title}</h3>
                        <p className="text-sm text-gray-500">{artwork.medium}, {artwork.dimensions}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-artvista-purple-dark font-medium">
                            {formatPrice(artwork.price)}
                          </span>
                          {artwork.sold && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Sold
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/artwork/${artwork.id}`}>View</a>
                          </Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium mb-2">No artworks yet</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't added any artworks to your portfolio yet.
                  </p>
                  <Button onClick={() => document.getElementById('add-artwork-tab')?.click()}>
                    Add Your First Artwork
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Add Artwork Tab */}
        <TabsContent value="add-artwork">
          <Card>
            <CardHeader>
              <CardTitle>Add New Artwork</CardTitle>
              <CardDescription>Upload and list your artwork for sale</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Artwork Title <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title"
                      name="title"
                      placeholder="Enter the title of your artwork"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter price in INR"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Describe your artwork, its inspiration, techniques used, etc."
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medium">Medium</Label>
                    <Input 
                      id="medium"
                      name="medium"
                      placeholder="E.g., Oil on Canvas"
                      value={formData.medium}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input 
                      id="dimensions"
                      name="dimensions"
                      placeholder="E.g., 20 x 30 inches"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abstract">Abstract</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                        <SelectItem value="Portrait">Portrait</SelectItem>
                        <SelectItem value="Still Life">Still Life</SelectItem>
                        <SelectItem value="Sculpture">Sculpture</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Digital">Digital</SelectItem>
                        <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Architecture">Architecture</SelectItem>
                        <SelectItem value="Wildlife">Wildlife</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags"
                    name="tags"
                    placeholder="E.g., nature, abstract, modern"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Artwork Image <span className="text-red-500">*</span></Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 mb-2">Drag and drop your image here or click to browse</p>
                      <p className="text-xs text-gray-400">Supported formats: JPG, PNG, WEBP. Max size: 5MB</p>
                      <input 
                        type="file" 
                        id="image" 
                        className="hidden" 
                        accept="image/*"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button type="button" variant="outline">Save as Draft</Button>
                  <Button type="submit">List for Sale</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Track your sales and orders</CardDescription>
            </CardHeader>
            <CardContent>
              {soldArtworks.length > 0 ? (
                <div className="space-y-4">
                  {soldArtworks.map((artwork) => (
                    <div key={artwork.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <img 
                            src={artwork.image} 
                            alt={artwork.title} 
                            className="w-16 h-16 object-cover rounded-md" 
                          />
                          <div>
                            <h3 className="font-medium">{artwork.title}</h3>
                            <p className="text-sm text-gray-500">Sold on {new Date(artwork.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(artwork.price)}</p>
                          <span className="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Commission: {formatPrice(artwork.price * 0.2)}
                        </p>
                        <p className="text-sm font-medium">
                          Net Earnings: {formatPrice(artwork.price * 0.8)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium mb-2">No sales yet</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't sold any artworks yet. Keep adding your work to increase your chances!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Stay updated on sales and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg ${
                        notification.read ? 'bg-gray-50' : 'bg-artvista-purple-light/20 border-l-4 border-artvista-purple'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className={notification.read ? 'text-gray-600' : 'font-medium'}>
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium mb-2">No notifications</h3>
                  <p className="text-gray-500">
                    You don't have any notifications at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDashboard;
