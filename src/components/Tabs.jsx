// src/components/Tabs.jsx
import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import previewGif from '../assets/preview.gif'; // Ensure the path is correct
import './Tabs.css'; // Import any necessary CSS styles

const Tabs = () => {
    const tabs = [
        { id: 1, tabTitle: 'Tab 1' },
        { id: 2, tabTitle: 'Tab 2' },
        { id: 3, tabTitle: 'Tab 3' },
        { id: 4, tabTitle: 'Tab 4' },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [tabContent, setTabContent] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTabContent = async () => {
            const content = {};

            for (const tab of tabs) {
                const cachedContent = localStorage.getItem(`tabContent_${tab.id}`);
                if (cachedContent) {
                    content[tab.id] = JSON.parse(cachedContent);
                } else {
                    try {
                        const response = await axios.get(`https://loripsum.net/api/1/short`);
                        content[tab.id] = response.data[0];
                        localStorage.setItem(`tabContent_${tab.id}`, JSON.stringify(response.data[0]));
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        content[tab.id] = 'Error loading content.';
                    }
                }
            }

            setTabContent(content);
            setIsLoading(false);
        };

        fetchTabContent();
    }, []);

    const handleTabClick = (id) => {
        setActiveTab(id);
    };

    return (
        <div className='container'>
            <div className='tabs'>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${tab.id === activeTab ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.tabTitle}
                    </button>
                ))}
            </div>
            <div className='tab-content'>
                {isLoading ? (
                    <img src={previewGif} alt="Loading Animation" />
                ) : (
                    <CSSTransition
                        in={!isLoading}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit
                    >
                        <div>
                            <h2>{`Title ${activeTab}`}</h2>
                            <p>{tabContent[activeTab] || 'Content not available.'}</p>
                        </div>
                    </CSSTransition>
                )}
            </div>
        </div>
    );
};

export default Tabs;
