import React, { useState, useEffect } from 'react';
import axios from 'axios';

const fetchTabContent = async (tab) => {
    try {
        // Check cache first
        const cachedContent = localStorage.getItem(`tabContent-${tab}`);
        if (cachedContent) {
            return JSON.parse(cachedContent);
        }

        // Fetch from API if not cached
        const response = await axios.get(`https://loripsum.net/api/1/${tab}`);
        const data = response.data;

        // Cache the data
        localStorage.setItem(`tabContent-${tab}`, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error("Error fetching tab content:", error);
        return "Error loading content.";
    }
};

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("short");
    const [content, setContent] = useState("");

    // Fetch content whenever activeTab changes
    useEffect(() => {
        const getContent = async () => {
            const data = await fetchTabContent(activeTab);
            setContent(data);
        };
        getContent();
    }, [activeTab]);

    return (
        <div className="tabs-container">
            <div className="tabs">
                {["short", "medium", "long"].map(tab => (
                    <button
                        key={tab}
                        className={tab === activeTab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                <p>{content}</p>
            </div>
        </div>
    );
};

export default Tabs;
