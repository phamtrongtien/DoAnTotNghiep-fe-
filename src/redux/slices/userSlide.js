import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
    access_token: '',
    id: '',
    isAdmin: false,
    city: ''
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {
                city = state.city,
                isAdmin = state.isAdmin,
                _id = state.id,
                name = state.name,
                email = state.email,
                phone = state.phone,
                address = state.address,
                avatar = state.avatar,
                access_token = state.access_token // Giữ nguyên token cũ nếu không có mới
            } = action.payload;

            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.access_token = access_token;
            state.id = _id;
            state.isAdmin = isAdmin;
            state.city = city;
        }
        ,
        resetUser: (state) => {

            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.access_token = '';
            state.id = ''
            state.isAdmin = false;
            state.city = ''
        }

    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer