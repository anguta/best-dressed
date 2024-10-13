import React, { useState } from 'react';
import { Upload} from 'lucide-react';
import './App.css';

interface WardrobeItem {
  name: string;
  url: string;
}

interface Outfit {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  footwear: WardrobeItem | null;
}

export default function FashionStylist() {
  const [wardrobe, setWardrobe] = useState<{
    tops: WardrobeItem[];
    bottoms: WardrobeItem[];
    footwear: WardrobeItem[];
  }>({
    tops: [],
    bottoms: [],
    footwear: []
  });
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: 'tops' | 'bottoms' | 'footwear') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setLoading(true);
      const newItems: WardrobeItem[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const imageUrl = URL.createObjectURL(file);
          return { name: file.name, url: imageUrl };
        })
      );
      setWardrobe(prev => ({
        ...prev,
        [category]: [...prev[category], ...newItems]
      }));
      setLoading(false);
    }
  };

  const generateOutfit = () => {
    setLoading(true);
    const top = wardrobe.tops[Math.floor(Math.random() * wardrobe.tops.length)] || null;
    const bottom = wardrobe.bottoms[Math.floor(Math.random() * wardrobe.bottoms.length)] || null;
    const footwear = wardrobe.footwear[Math.floor(Math.random() * wardrobe.footwear.length)] || null;
    
    setOutfit({ top, bottom, footwear });
    setLoading(false);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Best-Dressed</h1>
      <div className="wardrobe-container">
        {(['tops', 'bottoms', 'footwear'] as const).map((category) => (
          <div key={category} className="wardrobe-section">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="image-grid">
              {wardrobe[category].map((item, index) => (
                <div key={index} className="image-container">
                  <img src={item.url} alt={item.name} className="wardrobe-image" />
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, category)}
              className="hidden"
              id={`imageUpload-${category}`}
            />
            <label htmlFor={`imageUpload-${category}`} className="btn btn-outline">
              <Upload className="icon" /> Add {category.slice(0, -1)}(s)
            </label>
          </div>
        ))}
      </div>
      <div className="suggestion-container">
        <h2 className="text-xl font-semibold mb-4">Generated Outfit</h2>
        {outfit ? (
          <div className="outfit-display">
            {outfit.top && (
              <div className="outfit-item">
                <img src={outfit.top.url} alt={outfit.top.name} className="outfit-image" />
              </div>
            )}
            {outfit.bottom && (
              <div className="outfit-item">
                <img src={outfit.bottom.url} alt={outfit.bottom.name} className="outfit-image" />
              </div>
            )}
            {outfit.footwear && (
              <div className="outfit-item">
                <img src={outfit.footwear.url} alt={outfit.footwear.name} className="outfit-image" />
              </div>
            )}
          </div>
        ) : (
          <p className="mb-4">Add some clothes and generate a stylish outfit!</p>
        )}
        <button 
          onClick={generateOutfit} 
          className="btn btn-primary"
          disabled={Object.values(wardrobe).every(arr => arr.length === 0) || loading}
        >
          Generate Outfit
        </button>
      </div>
      {loading && 
        <div className="loading-overlay">
          <div className="loading-content">Loading...</div>
        </div>
      }
    </div>
  );
}