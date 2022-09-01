import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createRoot } from 'react-dom/client';
import './fontawesome';

import store, { persistor } from 'store';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('app');
const Root = createRoot(container);
Root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>
);
