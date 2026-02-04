module.exports = [
"[project]/app/add-location/context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrderProvider",
    ()=>OrderProvider,
    "useOrder",
    ()=>useOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const initialOrder = {
    location: null,
    bundle: null,
    phoneNumber: null,
    addons: [],
    agreementAccepted: false
};
const OrderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OrderProvider({ children }) {
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialOrder);
    const setLocation = (location)=>{
        setOrder((prev)=>({
                ...prev,
                location
            }));
    };
    const setBundle = (bundle)=>{
        setOrder((prev)=>({
                ...prev,
                bundle
            }));
    };
    const setPhoneNumber = (phoneNumber)=>{
        setOrder((prev)=>({
                ...prev,
                phoneNumber
            }));
    };
    const addAddon = (addon)=>{
        setOrder((prev)=>{
            if (prev.addons.find((a)=>a.id === addon.id)) return prev;
            return {
                ...prev,
                addons: [
                    ...prev.addons,
                    addon
                ]
            };
        });
    };
    const removeAddon = (addonId)=>{
        setOrder((prev)=>({
                ...prev,
                addons: prev.addons.filter((a)=>a.id !== addonId)
            }));
    };
    const setAgreementAccepted = (accepted)=>{
        setOrder((prev)=>({
                ...prev,
                agreementAccepted: accepted
            }));
    };
    const clearOrder = ()=>{
        setOrder(initialOrder);
    };
    const getCartTotal = ()=>{
        let monthly = 0;
        let oneTime = 0;
        if (order.bundle) {
            monthly += order.bundle.price;
        }
        order.addons.forEach((addon)=>{
            if (addon.billingCycle === 'monthly') {
                monthly += addon.price;
            } else {
                oneTime += addon.price;
            }
        });
        return {
            monthly,
            oneTime
        };
    };
    const getCartItems = ()=>{
        const items = [];
        if (order.location) {
            items.push({
                id: 'location',
                name: order.location.name,
                price: 0,
                type: 'location'
            });
        }
        if (order.bundle) {
            items.push({
                id: order.bundle.id,
                name: `${order.bundle.name} ${order.bundle.tier !== 'The Essentials' ? order.bundle.tier : ''}`.trim(),
                price: order.bundle.price,
                type: 'bundle'
            });
        }
        order.addons.forEach((addon)=>{
            items.push({
                id: addon.id,
                name: addon.name,
                price: addon.price,
                type: 'addon'
            });
        });
        return items;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OrderContext.Provider, {
        value: {
            order,
            setLocation,
            setBundle,
            setPhoneNumber,
            addAddon,
            removeAddon,
            setAgreementAccepted,
            clearOrder,
            getCartTotal,
            getCartItems
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/add-location/context.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
function useOrder() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}
}),
"[project]/app/add-location/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddLocationLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$add$2d$location$2f$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/add-location/context.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function AddLocationLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$add$2d$location$2f$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrderProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/add-location/layout.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_add-location_bc6707df._.js.map