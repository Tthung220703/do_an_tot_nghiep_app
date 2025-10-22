import { StyleSheet } from 'react-native';

export const homestaysScreenStyles = StyleSheet.create({
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
    // Search and filter styles
    searchContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        backgroundColor: '#ffffff',
        marginBottom: 12,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    filterButtonActive: {
        backgroundColor: '#c026d3',
        borderColor: '#c026d3',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginLeft: 4,
    },
    filterButtonTextActive: {
        color: '#ffffff',
    },
    // Homestay card styles
    homestayCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#d1d5db',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
    },
    homestayImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f3f4f6',
    },
    homestayContent: {
        padding: 16,
    },
    homestayName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    homestayLocation: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    homestayAmenities: {
        fontSize: 14,
        color: '#c026d3',
        marginBottom: 8,
        fontWeight: '500',
    },
    homestayRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#f59e0b',
        fontWeight: '600',
        marginLeft: 4,
    },
    homestayPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#c026d3',
        marginBottom: 8,
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
});
