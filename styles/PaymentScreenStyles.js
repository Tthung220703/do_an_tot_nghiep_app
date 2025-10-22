import { StyleSheet } from 'react-native';

export const paymentScreenStyles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#f6f7fb' },
    container: { flexGrow: 1, padding: 5 },
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
        marginBottom: 16,
    },
    detailsBox: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
    },
    detailsText: {
        fontSize: 16,
        color: '#334155',
        marginBottom: 10,
    },
    notice: {
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 16, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    primaryBtn: { marginTop: 8, backgroundColor: '#c026d3',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center'},
    primaryBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        
    },
});


