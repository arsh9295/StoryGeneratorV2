import React, { useState } from 'react';
import Layout from '../components/Layout';

const Home = () => {
    const [formData, setFormData] = useState({
        language: '',
        storyType: '',
        storyLength: '',
        model: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleGenerate = () => {
        console.log('Generating story with:', formData);
        // Add your generation logic here
    };

    return (
        <Layout>
            <div className="container">
                <h1 className="text-center mt-4">Welcome to Story Generater</h1>
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
                                <input 
                                    list="storyLengths" 
                                    className="form-control" 
                                    placeholder="Select or Enter Story Length"
                                    name="storyLength"
                                    value={formData.storyLength}
                                    onChange={handleInputChange}
                                />
                                <datalist id="storyLengths">
                                    <option value="20 minutes" />
                                    <option value="40 minutes" />
                                    <option value="50 minutes" />
                                    <option value="60 minutes" />
                                    <option value="2 hours" />
                                    <option value="3 hours" />
                                </datalist>
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
                                    <option value="claude">Claude</option>
                                    <option value="llama">LLaMA</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={handleGenerate}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
