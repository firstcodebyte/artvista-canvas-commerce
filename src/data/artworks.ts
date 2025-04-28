
export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  image: string;
  medium: string;
  dimensions: string;
  artistId: string;
  artistName: string;
  createdAt: string;
  category: string;
  tags: string[];
  sold: boolean;
}

// Sample artworks
export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Mystic Mountains',
    description: 'A serene landscape painting inspired by the majestic Himalayas. This artwork captures the tranquility and grandeur of the mountains at dawn, with gentle hues of purple and gold illuminating the peaks.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3',
    medium: 'Oil on Canvas',
    dimensions: '30 x 40 inches',
    artistId: '1',
    artistName: 'Anika Sharma',
    createdAt: '2023-05-15',
    category: 'Landscape',
    tags: ['mountains', 'nature', 'contemporary'],
    sold: false
  },
  {
    id: '2',
    title: 'Urban Symphony',
    description: 'A vibrant abstract representation of the modern Indian cityscape, capturing the energy, chaos, and beauty of urban life through dynamic brush strokes and a bold color palette.',
    price: 25000,
    discount: 22000,
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833',
    medium: 'Acrylic on Canvas',
    dimensions: '48 x 36 inches',
    artistId: '2',
    artistName: 'Raj Patel',
    createdAt: '2023-07-10',
    category: 'Abstract',
    tags: ['urban', 'modern', 'colorful'],
    sold: false
  },
  {
    id: '3',
    title: 'Golden Temple Reflections',
    description: 'A stunning portrayal of the iconic Golden Temple in Amritsar, with its reflection in the sacred pool. The artwork captures the spiritual essence and architectural brilliance of this historic landmark.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
    medium: 'Watercolor on Paper',
    dimensions: '24 x 36 inches',
    artistId: '3',
    artistName: 'Gurpreet Singh',
    createdAt: '2023-04-22',
    category: 'Architecture',
    tags: ['spiritual', 'heritage', 'traditional'],
    sold: true
  },
  {
    id: '4',
    title: 'Monsoon Melody',
    description: 'An evocative painting capturing the beauty of the Indian monsoon, with raindrops creating patterns on water and lush greenery coming alive under the nourishing rain.',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    medium: 'Mixed Media on Canvas',
    dimensions: '36 x 24 inches',
    artistId: '1',
    artistName: 'Anika Sharma',
    createdAt: '2023-08-05',
    category: 'Landscape',
    tags: ['rain', 'nature', 'weather'],
    sold: false
  },
  {
    id: '5',
    title: 'Dance of Tradition',
    description: 'A dynamic painting capturing the grace and vibrancy of classical Indian dance forms, with figures dressed in traditional attire, expressing stories through their elegant movements.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    medium: 'Acrylic on Canvas',
    dimensions: '40 x 30 inches',
    artistId: '4',
    artistName: 'Meera Krishnan',
    createdAt: '2023-06-18',
    category: 'Cultural',
    tags: ['dance', 'tradition', 'movement'],
    sold: false
  },
  {
    id: '6',
    title: 'Architectural Harmony',
    description: 'A contemporary take on traditional Indian architecture, showcasing the geometric patterns and intricate details that make Indian buildings unique and visually striking.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a',
    medium: 'Digital Print on Canvas',
    dimensions: '48 x 36 inches',
    artistId: '5',
    artistName: 'Vikram Mehta',
    createdAt: '2023-03-30',
    category: 'Architecture',
    tags: ['buildings', 'geometry', 'contemporary'],
    sold: false
  },
  {
    id: '7',
    title: 'Wildlife Whispers',
    description: 'A detailed portrait of Indian wildlife, focusing on the majestic Bengal tiger in its natural habitat, highlighting the beauty and importance of conservation efforts.',
    price: 40000,
    discount: 36000,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
    medium: 'Oil on Canvas',
    dimensions: '36 x 48 inches',
    artistId: '6',
    artistName: 'Arjun Desai',
    createdAt: '2023-09-12',
    category: 'Wildlife',
    tags: ['tiger', 'nature', 'conservation'],
    sold: false
  },
  {
    id: '8',
    title: 'Cosmic Connections',
    description: 'An abstract exploration of spirituality and cosmic energy, inspired by ancient Indian philosophy and the concept of interconnectedness between all living beings.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    medium: 'Mixed Media on Canvas',
    dimensions: '30 x 30 inches',
    artistId: '2',
    artistName: 'Raj Patel',
    createdAt: '2023-07-28',
    category: 'Abstract',
    tags: ['spiritual', 'cosmos', 'energy'],
    sold: false
  }
];

// Function to get artist by ID
export const getArtistById = (id: string) => {
  const artistArtworks = artworks.filter(artwork => artwork.artistId === id);
  if (artistArtworks.length > 0) {
    const { artistId, artistName } = artistArtworks[0];
    return {
      id: artistId,
      name: artistName,
      artworks: artistArtworks
    };
  }
  return null;
};

// Function to get artwork by ID
export const getArtworkById = (id: string) => {
  return artworks.find(artwork => artwork.id === id) || null;
};

// Function to search artworks
export const searchArtworks = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return artworks.filter(
    artwork =>
      artwork.title.toLowerCase().includes(lowercaseQuery) ||
      artwork.artistName.toLowerCase().includes(lowercaseQuery) ||
      artwork.description.toLowerCase().includes(lowercaseQuery) ||
      artwork.category.toLowerCase().includes(lowercaseQuery) ||
      artwork.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Function to filter artworks by category
export const filterArtworksByCategory = (category: string) => {
  return artworks.filter(artwork => artwork.category === category);
};

// Get all unique categories
export const getCategories = () => {
  const categories = new Set(artworks.map(artwork => artwork.category));
  return Array.from(categories);
};

// Get related artworks
export const getRelatedArtworks = (artworkId: string, limit = 4) => {
  const artwork = getArtworkById(artworkId);
  if (!artwork) return [];
  
  // Get artworks in the same category or by the same artist
  const related = artworks.filter(
    a => a.id !== artworkId && (a.category === artwork.category || a.artistId === artwork.artistId)
  );
  
  // Shuffle and limit
  return related
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
};
