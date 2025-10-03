import { StyleSheet } from 'react-native';

export const cityDetailsStyles = StyleSheet.create({
    page: { 
        flex: 1, 
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50, // Add padding to avoid status bar
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 0,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 16,
        color: '#c026d3',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 14,
        color: '#64748b',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionButton: {
        padding: 8,
    },
    accountButton: {
        padding: 8,
    },
    searchSection: {
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        color: '#0f172a',
    },
    searchButton: {
        backgroundColor: '#c026d3',
        padding: 12,
        marginRight: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        color: '#0f172a',
    },
    flatListContent: {
        paddingHorizontal: 5,
    },
    card: {
        width: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    placeImage: {
        width: '100%',
        height: 130,
    },
    cardContent: {
        padding: 12,
    },
    placeName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        color: '#0f172a',
    },
    amenities: {
        fontSize: 14,
        color: '#c026d3',
        marginBottom: 6,
    },
    placeAddress: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 6,
    },
    placeRating: {
        fontSize: 14,
        color: '#f59e0b',
        fontWeight: '600',
    },
    noDataText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginVertical: 20,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        padding: 20,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginTop: 8,
        marginBottom: 4,
    },
    userLocation: {
        fontSize: 14,
        color: '#64748b',
    },
    modalSection: {
        marginBottom: 24,
    },
    cityList: {
        maxHeight: 200,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    cityItemSelected: {
        backgroundColor: '#f8fafc',
    },
    cityItemText: {
        fontSize: 16,
        color: '#0f172a',
    },
    cityItemTextSelected: {
        color: '#c026d3',
        fontWeight: '600',
    },
    modalActions: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#0f172a',
        marginLeft: 12,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    logoutText: {
        color: '#ef4444',
    },
    // City picker styles
    cityPickerButton: {
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        marginBottom: 20,
    },
    cityPickerText: {
        fontSize: 16,
        color: '#0f172a',
    },
    cityPickerArrow: {
        fontSize: 12,
        color: '#9aa3af',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
    },
});
