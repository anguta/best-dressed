import React, { useState } from 'react';
import { Upload, Camera } from 'lucide-react';
import './App.css';

export default function FashionStylist() {
  const [wardrobe, setWardrobe] = useState({
    tops: [],
    bottoms: [],
    accessories: []
  });
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event, category) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const imageUrl = URL.createObjectURL(file);
      setWardrobe(prev => ({
        ...prev,
        [category]: [...prev[category], { name: file.name, url: imageUrl }]
      }));
      setLoading(false);
    }
  };

  const getSuggestion = () => {
    setLoading(true);
    const top = wardrobe.tops[Math.floor(Math.random() * wardrobe.tops.length)];
    const bottom = wardrobe.bottoms[Math.floor(Math.random() * wardrobe.bottoms.length)];
    const accessory = wardrobe.accessories[Math.floor(Math.random() * wardrobe.accessories.length)];
    
    const suggestion = `Try wearing ${top?.name || 'a top'} with ${bottom?.name || 'a bottom'}, and accessorize with ${accessory?.name || 'an accessory'}.`;
    setSuggestion(suggestion);
    setLoading(false);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Fashion Stylist</h1>
      <div className="wardrobe-container">
        {['tops', 'bottoms', 'accessories'].map((category) => (
          <div key={category} className="wardrobe-section">
            <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="image-grid">
              {wardrobe[category].map((item, index) => (
                <div key={index} className="image-container">
                  <img src={item.url} alt={item.name} className="wardrobe-image" />
                  <p className="text-sm mt-2">{item.name}</p>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, category)}
              className="hidden"
              id={`imageUpload-${category}`}
            />
            <label htmlFor={`imageUpload-${category}`} className="btn btn-outline">
              <Upload className="icon" /> Add {category.slice(0, -1)}
            </label>
          </div>
        ))}
      </div>
      <div className="suggestion-container">
        <h2 className="text-xl font-semibold mb-4">Generate Outfit</h2>
        <p className="mb-4">{suggestion || "Add some clothes and get a stylish suggestion!"}</p>
        <button 
          onClick={getSuggestion} 
          className="btn btn-primary"
          disabled={Object.values(wardrobe).every(arr => arr.length === 0) || loading}
        >
          Generate
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
