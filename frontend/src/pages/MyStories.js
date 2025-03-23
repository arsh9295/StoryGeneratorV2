import React from 'react';
import Layout from '../components/Layout';

const MyStories = () => {
    return (
        <Layout>
            <div className="container mt-4">
                <h1>My Stories</h1>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="list-group">
                            <a href="#" className="list-group-item list-group-item-action">
                                <h5 className="mb-1">Story Title 1</h5>
                                <small className="text-muted">Last modified: 2 days ago</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MyStories;
