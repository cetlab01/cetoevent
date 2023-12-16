// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Web3 from 'web3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import MasterPlannerABI from './components/contracts/MasterPlannerABI.json';
import CreateEvent from './components/CreateEvent';
import Homepage from './components/HomePage';
import UserDashboard from './components/UserDashboard';
import CancelEvent from './components/CancelEvent';
import ResellTicket from './components/ResellTicket';
import RateEvent from './components/RateEvent';
import PurchaseTicket from './components/PurchaseTicket';

import AllEvents from './AllEvents/AllEvents'; // Import the AllEvents component
import './App.css';

const contractAddress = '0xb35abf819cffd06c54e3e9f1352a66ebe0672f3a';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialization code for web3, contract, and account
    async function initializeWeb3() {
      try {
        let web3Instance;

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
          // Use MetaMask provider
          const provider = window.ethereum;
          await provider.request({ method: 'eth_requestAccounts' });
          web3Instance = new Web3(provider);
        } else {
          // Fallback to Infura or your local Ethereum node
          const infuraUrl = 'https://sepolia.infura.io/v3/67f394e5c0e244a085fde01e3db2e2d2';
          web3Instance = new Web3(new Web3.providers.HttpProvider(infuraUrl));
        }

        setWeb3(web3Instance);

        // Get the current account
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        // Initialize contract
        const contractInstance = new web3Instance.eth.Contract(MasterPlannerABI, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error('Error initializing web3:', error.message);
      }
    }

    initializeWeb3();
  }, []);

  const handleConnectWallet = async () => {
    if (account) {
      // Disconnect wallet logic (reset account state)
      setAccount(null);
    } else {
      // Connect wallet logic
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the current selected network
        const networkId = await web3.eth.net.getId();

        // Define the networks you want to support
        const supportedNetworks = {
          1: 'Mainnet',
          2: 'Sepolia',
          3: 'Ropsten', // Add more networks as needed
        };

        // Prompt the user to select a network
        const selectedNetwork = prompt(
          'Select a network:\n' + Object.entries(supportedNetworks).map(([id, name]) => `${name} (${id})`).join('\n')
        );

        // Validate the selected network
        if (!(selectedNetwork in supportedNetworks)) {
          alert('Invalid network selection');
          return;
        }

        // Set the network to the selected one
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: Number(selectedNetwork),
              chainName: supportedNetworks[selectedNetwork],
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/67f394e5c0e244a085fde01e3db2e2d2'], // Replace with your Infura API key
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });

        // Get the current account
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div>
        <div className="header">
          {/* Header content */}
          <div className="logo">
            <Link to="/">
              <img src="./company-logo.png" alt="CeTLab" />
            </Link>
          </div>
          <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </div>
          <div className={`header-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/create-event" onClick={closeMobileMenu}>
              Create Event
            </Link>
            <Link to="/cancel-event" onClick={closeMobileMenu}>
              Cancel Event
            </Link>
            <Link to="/purchase-ticket" onClick={closeMobileMenu}>
              Purchase Ticket
            </Link>

            <Link to="/Rate-Event" onClick={closeMobileMenu}>
              Rate Event
            </Link>
            <Link to="/User-Dashboard" onClick={closeMobileMenu}>
              UserDashboard
            </Link>
            <Link to="Resell-Ticket" onClick={closeMobileMenu}>
              ResellTicket
            </Link>
          </div>
          <div className="wallet-connector">
            {account ? (
              <span>
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
                <button className="wallet-button" onClick={handleConnectWallet}>
                  Disconnect
                </button>
              </span>
            ) : (
              <button className="wallet-button" onClick={handleConnectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <Route path="/create-event" component={CreateEvent} />
          <Route path="/User-dashboard" component={UserDashboard} />
          <Route path="/Resell-ticket" component={ResellTicket} />
          <Route path="/Cancel-event" component={CancelEvent} />
          <Route path="/purchase-Ticket" component={PurchaseTicket} />
          <Route path="/rate-event" component={RateEvent} />
          <Route path="/All-Events" component={AllEvents} /> {/* Added route for AllEvents */}
          {/* Add other routes as needed */}
        </Switch>

        {/* Footer */}
        <div className="footer">
          <div className="social-links">
            <a href="https://github.com/cetlab01" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://twitter.com/cetotoken" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <div className="copyright">
            &copy; 2023 CeTLab. All rights reserved.
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
