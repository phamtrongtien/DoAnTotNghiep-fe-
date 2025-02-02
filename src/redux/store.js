import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import userReducer from './slices/userSlide'
import productReducer from './slices/productSlice'
import orderReducer from './slices/orderSlice'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react';
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['product', 'user']
}
const rootReducer = combineReducers({
    product: productReducer,
    user: userReducer,
    order: orderReducer
})

const persistdReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistdReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })

})
export let persistor = persistStore(store)