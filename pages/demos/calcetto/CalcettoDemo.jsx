import { useEffect } from 'react';
import App from './components/App.jsx';
import { initializeMockData } from './lib/mockData.js';
import './styles/index.css';

export default function CalcettoDemo() {
    useEffect(() => {
        // Initialize mock data on first load
        initializeMockData();
    }, []);

    return (
        <div className="calcetto-demo-wrapper">
            <App />
        </div>
    );
}