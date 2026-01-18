import React, { useState } from 'react';

export default function Demo3() {
    const [products] = useState([
        { name: 'Arance Bio', price: 2.50, unit: 'kg', image: '🍊' },
        { name: 'Limoni di Sicilia', price: 3.20, unit: 'kg', image: '🍋' },
        { name: 'Mandarini', price: 2.80, unit: 'kg', image: '🍊' },
        { name: 'Pompelmi Rosa', price: 3.50, unit: 'kg', image: '🍇' },
    ]);

    const [cart, setCart] = useState({});

    const addToCart = (product) => {
        setCart(prev => ({
            ...prev,
            [product.name]: (prev[product.name] || 0) + 1
        }));
    };

    const cartTotal = Object.entries(cart).reduce((sum, [name, qty]) => {
        const product = products.find(p => p.name === name);
        return sum + (product.price * qty);
    }, 0);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-8 rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold mb-2">🍊 Agrumi Siciliani</h1>
                <p className="text-orange-100">E-commerce agrumi freschi dal produttore</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">🛒 Prodotti</h2>
                    <div className="grid gap-4">
                        {products.map((product, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">{product.image}</span>
                                    <div>
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-orange-600 font-semibold">€{product.price.toFixed(2)}/{product.unit}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Aggiungi
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">🛍️ Carrello</h2>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-4">
                        {Object.keys(cart).length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Carrello vuoto</p>
                        ) : (
                            <>
                                <div className="space-y-3 mb-4">
                                    {Object.entries(cart).map(([name, qty]) => {
                                        const product = products.find(p => p.name === name);
                                        return (
                                            <div key={name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>{name}</span>
                                                <span className="font-semibold">
                                                    {qty}x €{product.price.toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-bold">Totale</span>
                                        <span className="text-2xl font-bold text-orange-600">
                                            €{cartTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors">
                                        Procedi al Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}