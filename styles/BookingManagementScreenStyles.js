import { StyleSheet } from 'react-native';

export const bookingManagementScreenStyles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#f6f7fb' },
    container: { flexGrow: 1, padding: 20 },
    // Header styles
    header: {
        backgroundColor: '#ffffff',
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 16,
        color: '#c026d3',
        fontWeight: '600',
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        color: '#0f172a',
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 16,
    },
    bookingItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    hotelName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    bookingDetail: {
        fontSize: 15,
        color: '#64748b',
        marginBottom: 6,
    },
    boldText: {
        fontWeight: '600',
        color: '#0f172a',
    },
    statusText: {
        fontWeight: '600',
        color: '#007AFF',
    },
    noBookingText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#64748b',
        marginTop: 40,
        paddingHorizontal: 20,
    },
});
