import { StyleSheet } from 'react-native';

export const aiChatScreenStyles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#f6f7fb' },
    container: { flex: 1, backgroundColor: '#f5f7fa' },
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
    // Chat styles
    list: { padding: 12 },
    bubble: { 
        padding: 12, 
        borderRadius: 14, 
        marginBottom: 10, 
        maxWidth: '85%' 
    },
    bot: { 
        backgroundColor: '#f8f9fa', 
        borderWidth: 1, 
        borderColor: '#e9ecef', 
        alignSelf: 'flex-start' 
    },
    user: { 
        backgroundColor: '#c026d3', 
        alignSelf: 'flex-end' 
    },
    text: { 
        color: '#222', 
        lineHeight: 20 
    },
    // Card styles
    card: { 
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#e5e7eb', 
        borderRadius: 12, 
        overflow: 'hidden', 
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardImage: { 
        width: 260, 
        height: 140, 
        backgroundColor: '#f3f4f6' 
    },
    cardBody: { 
        padding: 12, 
        width: 260 
    },
    cardTitle: { 
        fontWeight: '700', 
        color: '#0f172a', 
        marginBottom: 4,
        fontSize: 16
    },
    cardMeta: { 
        color: '#64748b', 
        marginBottom: 4,
        fontSize: 14
    },
    cardAmenities: { 
        color: '#c026d3',
        fontSize: 13
    },
    // Input styles
    inputRow: { 
        flexDirection: 'row', 
        padding: 12, 
        backgroundColor: '#fff', 
        borderTopWidth: 1, 
        borderTopColor: '#e5e7eb' 
    },
    input: { 
        flex: 1, 
        padding: 12, 
        borderWidth: 1, 
        borderColor: '#e5e7eb', 
        borderRadius: 12, 
        backgroundColor: '#fff', 
        maxHeight: 120,
        fontSize: 15
    },
    send: { 
        marginLeft: 8, 
        backgroundColor: '#c026d3', 
        paddingHorizontal: 16, 
        justifyContent: 'center', 
        borderRadius: 12,
        paddingVertical: 12
    },
    sendDisabled: { 
        backgroundColor: '#a78bfa' 
    },
    sendText: { 
        color: '#fff', 
        fontWeight: '600',
        fontSize: 15
    },
});
