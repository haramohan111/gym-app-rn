import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddMusic.css'; // Create this CSS file

const AddMusic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
    audioFile: null,
    coverImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioPreview, setAudioPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));

    // Create previews
    if (name === 'audioFile' && files[0]) {
      setAudioPreview(URL.createObjectURL(files[0]));
    }
    if (name === 'coverImage' && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }
    
    if (!formData.audioFile) {
      newErrors.audioFile = 'Audio file is required';
    } else if (!formData.audioFile.type.includes('audio/')) {
      newErrors.audioFile = 'Please upload a valid audio file';
    }
    
    if (formData.coverImage && !formData.coverImage.type.includes('image/')) {
      newErrors.coverImage = 'Please upload a valid image file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload files to your server
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('artist', formData.artist);
      formPayload.append('album', formData.album);
      formPayload.append('genre', formData.genre);
      formPayload.append('releaseDate', formData.releaseDate);
      formPayload.append('audioFile', formData.audioFile);
      if (formData.coverImage) {
        formPayload.append('coverImage', formData.coverImage);
      }

      // Mock API call
      console.log('Form data to be submitted:', Object.fromEntries(formPayload));
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // On success, redirect to manage music page
      navigate('/admin/manage-music');
    } catch (error) {
      console.error('Error adding music:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-music-container">
      <div className="card">
        <h2>Add New Music</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter song title"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="artist">Artist*</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                placeholder="Enter artist name"
                className={errors.artist ? 'error' : ''}
              />
              {errors.artist && <span className="error-message">{errors.artist}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                placeholder="Enter album name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select genre</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Electronic">Electronic</option>
                <option value="Classical">Classical</option>
                <option value="Jazz">Jazz</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group file-upload">
              <label htmlFor="audioFile">Audio File*</label>
              <input
                type="file"
                id="audioFile"
                name="audioFile"
                accept="audio/*"
                onChange={handleFileChange}
                className={errors.audioFile ? 'error' : ''}
              />
              {errors.audioFile && <span className="error-message">{errors.audioFile}</span>}
              {audioPreview && (
                <audio controls className="audio-preview">
                  <source src={audioPreview} type={formData.audioFile?.type} />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
            
            <div className="form-group file-upload">
              <label htmlFor="coverImage">Cover Image</label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.coverImage ? 'error' : ''}
              />
              {errors.coverImage && <span className="error-message">{errors.coverImage}</span>}
              {imagePreview && (
                <img src={imagePreview} alt="Cover preview" className="image-preview" />
              )}
            </div>
          </div>
          
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? 'Uploading...' : 'Add Music'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/manage-music')}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMusic;