import React from 'react';
import { useRecoilValue } from 'recoil';
import { productCountSelector, categoryCountSelector, orderCountSelector } from '../../recoil/selectors';

export default function DashCount() {
    const productCount = useRecoilValue(productCountSelector);
    const categoryCount = useRecoilValue(categoryCountSelector);
    const orderCount = useRecoilValue(orderCountSelector);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 text-white p-4 rounded-lg h-[174px] flex flex-col justify-between shadow-lg">
                <div className="text-lg">Total Products</div>
                <div className="text-2xl font-bold">{productCount}</div>
            </div>
            <div className="bg-gray-700 text-white p-4 rounded-lg h-[174px] flex flex-col justify-between shadow-lg">
                <div className="text-lg">Total Categories</div>
                <div className="text-2xl font-bold">{categoryCount}</div>
            </div>
            <div className="bg-gray-600 text-white p-4 rounded-lg h-[174px] flex flex-col justify-between shadow-lg">
                <div className="text-lg">Total Orders</div>
                <div className="text-2xl font-bold">{orderCount}</div>
            </div>
        </div>
    );
}