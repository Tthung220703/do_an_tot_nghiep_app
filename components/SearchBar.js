import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, styles }) => {
    return (
        <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm khách sạn"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9aa3af"
                />
                <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
                    <Icon name="search" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SearchBar;
