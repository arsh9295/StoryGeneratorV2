import React, { useState } from 'react';
import Layout from '../components/Layout';

const Settings = () => {
    const [settings, setSettings] = useState({
        geminiApiKey: '',
        gptApiKey: '',
        deepseekApiKey: '',
        storyOutputPath: '',
        gdrivePath: ''
    });

    const handleChange = (e) => {
        const newSettings = {
            ...settings,
            [e.target.name]: e.target.value
        };
        setSettings(newSettings);
        // Save to localStorage whenever settings change
        localStorage.setItem('settings', JSON.stringify(newSettings));
    };

    const handleBrowse = async (pathType) => {
        try {
            // Use window.electron.ipcRenderer if you've set up the preload script
            const result = await window.electron.ipcRenderer.invoke('select-directory');
            if (result) {
                setSettings(prev => ({
                    ...prev,
                    [pathType]: result
                }));
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
        }
    };

    return (
        <Layout>
            <div className="container mt-4">
                <h1>Settings</h1>
                <div className="row mt-4">
                    {/* API Keys Section */}
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">API Keys</h5>
                                <div className="mb-3">
                                    <label className="form-label">Gemini API Key</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="geminiApiKey"
                                        value={settings.geminiApiKey}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">GPT API Key</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="gptApiKey"
                                        value={settings.gptApiKey}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">DeepSeek API Key</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="deepseekApiKey"
                                        value={settings.deepseekApiKey}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Path Preferences Section */}
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Path Preferences</h5>
                                <div className="mb-3">
                                    <label className="form-label">Story Output Path</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="storyOutputPath"
                                            value={settings.storyOutputPath}
                                            onChange={handleChange}
                                        />
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => handleBrowse('storyOutputPath')}
                                        >
                                            Browse
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Google Drive Config Path</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="gdrivePath"
                                            value={settings.gdrivePath}
                                            onChange={handleChange}
                                        />
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={() => handleBrowse('gdrivePath')}
                                        >
                                            Browse
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Preferences Section */}
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">User Preferences</h5>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="darkMode" />
                                    <label className="form-check-label" htmlFor="darkMode">
                                        Dark Mode
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
