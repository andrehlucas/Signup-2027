(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/add-location/context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrderProvider",
    ()=>OrderProvider,
    "useOrder",
    ()=>useOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const initialOrder = {
    location: null,
    bundle: null,
    phoneNumber: null,
    addons: [],
    extensionCount: 0,
    agreementAccepted: false
};
const OrderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function OrderProvider({ children }) {
    _s();
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialOrder);
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
    const updateAddon = (addon)=>{
        setOrder((prev)=>({
                ...prev,
                addons: prev.addons.map((a)=>a.id === addon.id ? addon : a)
            }));
    };
    const setExtensionCount = (count)=>{
        setOrder((prev)=>({
                ...prev,
                extensionCount: Math.max(0, count)
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
        if (order.extensionCount > 0) {
            monthly += order.extensionCount * 25;
        }
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
        if (order.extensionCount > 0) {
            items.push({
                id: 'additional-extensions',
                name: 'Additional Extensions',
                price: order.extensionCount * 25,
                type: 'addon',
                quantity: order.extensionCount
            });
        }
        return items;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrderContext.Provider, {
        value: {
            order,
            setLocation,
            setBundle,
            setPhoneNumber,
            addAddon,
            removeAddon,
            updateAddon,
            setExtensionCount,
            setAgreementAccepted,
            clearOrder,
            getCartTotal,
            getCartItems
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/add-location/context.tsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_s(OrderProvider, "VT6T8iyAo17wj2vTHHFlw2IM0Yo=");
_c = OrderProvider;
function useOrder() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
}
_s1(useOrder, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "OrderProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/add-location/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddLocationLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$add$2d$location$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/add-location/context.tsx [app-client] (ecmascript)");
'use client';
;
;
function AddLocationLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$add$2d$location$2f$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/add-location/layout.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = AddLocationLayout;
var _c;
__turbopack_context__.k.register(_c, "AddLocationLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_add-location_804d0314._.js.map