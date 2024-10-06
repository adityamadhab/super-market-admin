import { atom } from 'recoil';

export const productsState = atom({
    key: 'productsState',
    default: [],
});

export const categoriesState = atom({
    key: 'categoriesState',
    default: [],
});

export const ordersState = atom({
    key: 'ordersState',
    default: [],
});

export const authTokenState = atom({
    key: 'authTokenState',
    default: localStorage.getItem('authToken') || null,
});