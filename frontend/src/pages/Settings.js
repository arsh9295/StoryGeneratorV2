import React from 'react';
import Layout from '../components/Layout';

const Settings = () => {
    return (
        <Layout>
            <div className="container mt-4">
                <h1>Settings</h1>
                <div className="row mt-4">
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
