import * as React from "react";
import { Admin, Resource } from 'react-admin';

import myDataProvider from './providers/dataProvider';
import authProvider from './providers/authProvider';

import Dashboard from './components/Dashboard';
import {ProductList} from "./components/products/ProductList";
import {ProductEdit} from "./components/products/ProductEdit";
import {ProductCreate} from "./components/products/ProductCreate";

const dataProvider = myDataProvider('http://localhost:8081');

const Main = () => (
    <Admin dataProvider={dataProvider} dashboard={Dashboard} authProvider={authProvider}>
        <Resource name="product" list={ProductList} edit={ProductEdit} create={ProductCreate} />
    </Admin>
)

export default Main;