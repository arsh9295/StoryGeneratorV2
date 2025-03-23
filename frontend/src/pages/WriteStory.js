import React from 'react';
import Layout from '../components/Layout';

const WriteStory = () => {
    return (
        <Layout>
            <div className="container mt-4">
                <h1>Write a New Story</h1>
                <div className="row mt-4">
                    <div className="col-12">
                        <textarea 
                            className="form-control" 
                            rows="10" 
                            placeholder="Start writing your story here..."
                        ></textarea>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default WriteStory;
