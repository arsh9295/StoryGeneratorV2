import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Home = () => {
    const [formData, setFormData] = useState({
        language: '',
        storyType: '',
        storyLength: '',
        model: ''
    });
    const [settings, setSettings] = useState({});
    
    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [story, setStory] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setError(null);
            const requestData = {
                ...formData,
                settings: settings
            };
            console.log('Request Data:', requestData); // Debugging line
            const response = await axios.post('http://localhost:8000/api/generate', requestData);
            setStory(response.data.story);
            // Show success message with smooth fade
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            successAlert.style.zIndex = '1050';
            successAlert.innerHTML = `
                <strong>Success!</strong> Your story has been generated.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.body.appendChild(successAlert);
            setTimeout(() => {
                successAlert.classList.remove('show');
                setTimeout(() => successAlert.remove(), 150);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to generate story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container">
                <h1 className="text-center mt-4">Welcome to Story Generator</h1>
                <p className="text-center">Generate your amazing stories now!</p>
                
                <div className="d-flex align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    <div className="w-100">
                        <div className="row">
                            <div className="col-md-3">
                                <input 
                                    list="languages" 
                                    className="form-control" 
                                    placeholder="Select or Enter Language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                />
                                <datalist id="languages">
                                    <option value="Hindi" />
                                    <option value="English" />
                                </datalist>
                            </div>
                            
                            <div className="col-md-3">
                                <input 
                                    list="storyTypes" 
                                    className="form-control" 
                                    placeholder="Select or Enter Story Type"
                                    name="storyType"
                                    value={formData.storyType}
                                    onChange={handleInputChange}
                                />
                                <datalist id="storyTypes">
                                    <option value="Horror" />
                                    <option value="Time Travel" />
                                    <option value="Mystery" />
                                    <option value="Adventure" />
                                    <option value="Science Fiction" />
                                </datalist>
                            </div>
                            
                            <div className="col-md-3">
                                <select 
                                    className="form-select" 
                                    name="storyLength"
                                    value={formData.storyLength}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Story Length</option>
                                    <option value="short">Short (~ 20min to 40min)</option>
                                    <option value="medium">Medium (~ 50min to 80min)</option>
                                    <option value="long">Long (~ 90min to 120min)</option>
                                    <option value="extra_long">Extra Long (~ 130min to 180min)</option>
                                </select>
                            </div>
                            
                            <div className="col-md-3">
                                <select 
                                    className="form-select" 
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Model</option>
                                    <option value="gpt3.5">GPT-3.5</option>
                                    <option value="gpt4">GPT-4</option>
                                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                                    <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
                                    <option value="gemini-2.0-flash-thinking-exp">Gemini 2.5 Flash Thinking</option>
                                    <option value="deepseek-chat">DeepSeek Chat</option>
                                    <option value="deepseek-reasoner">DeepSeek Reasoner</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={handleGenerate}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Crafting your story...
                                        </>
                                    ) : 'Generate'}
                                </button>
                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        {error}
                                    </div>
                                )}
                                {loading && !error && (
                                    <div className="text-center mt-4">
                                        <div className="spinner-grow text-primary mx-1" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <div className="spinner-grow text-primary mx-1" role="status" style={{animationDelay: "0.2s"}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <div className="spinner-grow text-primary mx-1" role="status" style={{animationDelay: "0.4s"}}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {story && !loading && (
                                    <div className="mt-4">
                                        <h3>Generated Story:</h3>
                                        <div className="card">
                                            <div className="card-body">
                                                {story}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
