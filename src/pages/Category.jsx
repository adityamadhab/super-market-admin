import React from 'react'
import Sidebar from '../components/Sidebar'
import CategoryMain from '../components/CategoryMain'

export default function Category() {
    return (
        <div>
            <div className="flex">
                <Sidebar />
                <CategoryMain />
            </div>
        </div>
    )
}
