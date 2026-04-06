import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bookings';

export const createBooking = async (bookingData) => {
    const response = await axios.post(API_URL, bookingData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const getMyBookings = async () => {
    const response = await axios.get(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const cancelBooking = async (id) => {
    await axios.post(`${API_URL}/${id}/cancel`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export const updateBookingStatus = async (id, status) => {
    await axios.patch(`${API_URL}/${id}/status`, null, {
        params: { status },
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};
