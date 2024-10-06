import { selector } from 'recoil';
import { productsState, categoriesState, ordersState } from './atoms';

export const productCountSelector = selector({
    key: 'productCountSelector',
    get: ({ get }) => {
        const products = get(productsState);
        return products.length;
    },
});

export const categoryCountSelector = selector({
    key: 'categoryCountSelector',
    get: ({ get }) => {
        const categories = get(categoriesState);
        return categories.length;
    },
});

export const orderCountSelector = selector({
    key: 'orderCountSelector',
    get: ({ get }) => {
        const orders = get(ordersState);
        return orders.length;
    },
});