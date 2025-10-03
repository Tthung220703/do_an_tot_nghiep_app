import { firestore, auth } from '../../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const fetchPlaces = async (city) => {
    try {
        const hotelsRef = collection(firestore, 'hotels');
        const q = query(hotelsRef, where('city', '==', city));
        const querySnapshot = await getDocs(q);

        const hotelList = [];
        const homestayList = [];

        querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.type === 'hotel') hotelList.push({ id: doc.id, ...data });
            if (data.type === 'homestay') homestayList.push({ id: doc.id, ...data });
        });

        return { hotels: hotelList, homestays: homestayList };
    } catch (error) {
        console.error('Error fetching places:', error);
        return { hotels: [], homestays: [] };
    }
};

export const fetchUsername = async () => {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.log('No user is logged in');
            return '';
        }

        const userRef = doc(firestore, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            return userData.username || '';
        } else {
            console.log('No user document found!');
            return '';
        }
    } catch (error) {
        console.error('Error fetching username:', error);
        return '';
    }
};

export const fetchCities = async () => {
    try {
        const querySnapshot = await getDocs(collection(firestore, 'hotels'));
        const cityList = [];
        querySnapshot.forEach((doc) => {
            const cityName = doc.data().city;
            if (cityName && !cityList.includes(cityName)) {
                cityList.push(cityName);
            }
        });
        return cityList;
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

export const handleSearch = (searchQuery, hotels, homestays) => {
    if (searchQuery.trim()) {
        const filteredH = hotels.filter(hotel =>
            hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const filteredHm = homestays.filter(homestay =>
            homestay.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { filteredHotels: filteredH, filteredHomestays: filteredHm, hasSearched: true };
    } else {
        return { filteredHotels: hotels, filteredHomestays: homestays, hasSearched: false };
    }
};
