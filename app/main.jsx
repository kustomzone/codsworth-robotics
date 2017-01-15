'use strict';
import React from 'react';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {connect, Provider} from 'react-redux';

import store from './store';
import App from './containers/App';
import Jokes from './components/Jokes';
import Signup from './components/Signup';
import Login from './components/Login';
import WhoAmI from './components/WhoAmI';
import Checkout from './components/Checkout';
import AddProduct from './components/AddProduct';
import Orders from './components/Orders';
import ProductDetail from './components/ProductDetail';
import BrowseProducts from './components/BrowseProducts';

import {loadProducts, loadAllAndSelectOneProduct, setSelectedProduct} from './reducers/products';

const ExampleApp = connect(
  ({ auth }) => ({ user: auth })
)(
  ({ user, children }) =>
    <div>
      <nav>
        {user ? null : <Signup/>}
        {user ? <WhoAmI/> : <Login/>}
      </nav>
      {children}
    </div>
);

const onBrowse = function () {
  store.dispatch(loadProducts());
};

const setProduct = function (nextRouterState) {
  if (store.getState().products === []) {
    loadAllAndSelectOneProduct(+nextRouterState.params.id);
  } else {
    store.dispatch(
      setSelectedProduct(
        store.getState().products.find(product => {
          return (product.id === (+nextRouterState.params.id));
        })
      )
    );
  }
};

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/products" />
        <Route path="/jokes" component={Jokes} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/products/add" component={AddProduct} />
        <Route path="/orders" component={Orders} />
        <Route path="/products" component={BrowseProducts} onEnter={onBrowse} />
        <Route path="/products/:id" component={ProductDetail} onEnter={setProduct} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('page-content')
);
