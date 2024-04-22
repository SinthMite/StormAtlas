import React, { useState, useEffect } from 'react';
import { youtube } from 'scrape-youtube';


export default function NewsCoveragePage() {
    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                // Assuming you have a function named `youtube.search` that returns videos based on a search query
                const { videos } = await youtube.search('Short Change Hero');
                console.log("Video Data:", videos); // Log the fetched videos
                // Further processing of video data can be done here
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };

        fetchVideoData();
    }, []); // Empty dependency array to run effect only once

    return (
        <div>
            <h1>News Daily</h1>
        </div>
    );
}
