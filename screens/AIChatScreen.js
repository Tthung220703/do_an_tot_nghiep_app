import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyC538fctSehC036Jodw9E76mRqUPshf3BY');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const AIChatScreen = ({ route, navigation }) => {
  const selectedCity = route?.params?.city || null;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const [hotelsLookup, setHotelsLookup] = useState([]);

  useEffect(() => {
    // greeting cho KHÁCH HÀNG
    setMessages([{ id: Date.now().toString(), text: '👋 Xin chào! Tôi là AI tư vấn du lịch của bạn. Hãy nói yêu cầu: ngân sách, ngày ở, số người, muốn gần trung tâm/biển, tiện ích (hồ bơi, bữa sáng, chỗ đậu xe...) để tôi gợi ý khách sạn phù hợp.', isBot: true }]);
  }, []);

  const fetchContextData = async () => {
    // Dữ liệu dành cho KHÁCH HÀNG: danh sách khách sạn theo thành phố được chọn
    const hotelsQ = selectedCity
      ? query(collection(firestore, 'hotels'), where('city', '==', selectedCity))
      : collection(firestore, 'hotels');
    const hotelSnap = await getDocs(hotelsQ);
    const hotels = hotelSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    setHotelsLookup(hotels);
    return { hotels, city: selectedCity };
  };

  const checkIfDatabaseQuestion = (text) => {
    // Từ khóa dành cho KHÁCH HÀNG
    const kws = ['giá','ngân sách','rẻ','dưới','trên','gần','trung tâm','biển','tiện ích','hồ bơi','bữa sáng','đậu xe','wifi','gia đình','cặp đôi','đánh giá','rating','xếp hạng','khuyến mãi','ưu đãi','phòng trống','còn phòng','ngày','đêm','check in','check-out','hủy miễn phí','miễn phí','chính sách','so sánh','recommend','đề xuất','gợi ý','homestay','hotel','khách sạn'];
    const t = text.toLowerCase();
    return kws.some(k => t.includes(k));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: (Date.now()+1).toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const isDB = checkIfDatabaseQuestion(userMsg.text);
      let prompt = '';
      if (isDB) {
        const ctx = await fetchContextData();
        prompt = `Bạn là trợ lý du lịch hỗ trợ KHÁCH HÀNG. Thành phố: ${selectedCity || 'không xác định'}.\nDữ liệu khách sạn (có trường mainImage là ảnh):\n${JSON.stringify(ctx, null, 2)}\n\nHãy trả lời THEO ĐỊNH DẠNG JSON, không thêm chữ nào ngoài JSON:\n{\n  "type": "suggestions",\n  "items": [\n    {"name": string, "pricePerNight": string|number, "rating": number|null, "area": string|null, "amenities": string[], "imageUrl": string|null}\n  ],\n  "askMore": string|null\n}\n\nYêu cầu: chọn 3-5 khách sạn phù hợp; imageUrl lấy từ mainImage; area suy từ address; nếu thiếu thông tin (ngân sách, ngày, số người...), để items=[] và điền askMore.\n\nCâu hỏi khách: ${userMsg.text}`;
      } else {
        prompt = `Bạn là trợ lý trò chuyện thân thiện dành cho KHÁCH HÀNG du lịch. Hãy trả lời tự nhiên, ngắn gọn, tích cực. Tin nhắn: ${userMsg.text}`;
      }
      if (!genAI.apiKey) throw new Error('Thiếu GEMINI_API_KEY');
      // gọi API với retry 1 lần khi lỗi tạm thời
      const callOnce = async () => {
        const r = await model.generateContent(prompt);
        return r.response.text();
      };
      let text;
      try {
        text = await callOnce();
      } catch (err) {
        // retry một lần
        text = await callOnce();
      }
      // Thử parse JSON để hiển thị card đẹp
      let added = false;
      try {
        const cleaned = text
          .replace(/^```json[\s\S]*?\n|^```/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        const json = JSON.parse(cleaned);
        if (json && json.type === 'suggestions' && Array.isArray(json.items)) {
          const cards = json.items.map(it => ({
            name: it.name,
            pricePerNight: it.pricePerNight,
            rating: it.rating,
            area: it.area,
            amenities: it.amenities || [],
            imageUrl: it.imageUrl,
          }));
          setMessages(prev => [...prev, { id: (Date.now()+2).toString(), isBot: true, cards }]);
          if (json.askMore) {
            setMessages(prev => [...prev, { id: (Date.now()+3).toString(), isBot: true, text: json.askMore }]);
          }
          added = true;
        }
      } catch (_e) {
        // bỏ qua, fallback text
      }
      if (!added) {
        const botMsg = { id: (Date.now()+4).toString(), text, isBot: true };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (e) {
      const shortMsg = (e && (e.message || `${e}`)).toString().slice(0, 140);
      const botMsg = { id: (Date.now()+3).toString(), text: `Xin lỗi, có lỗi xảy ra. (${shortMsg})`, isBot: true };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.cards) {
      return (
        <View style={[styles.bubble, styles.bot]}>
          <Text style={[styles.text, { marginBottom: 6 }]}>Gợi ý cho bạn:</Text>
          {item.cards.map((card) => (
            <TouchableOpacity
              key={`${card.name}`}
              style={styles.card}
              onPress={() => {
                // tìm khách sạn tương ứng trong dữ liệu theo tên hoặc ảnh
                const match = hotelsLookup.find(h => h.hotelName === card.name) ||
                              hotelsLookup.find(h => h.mainImage === card.imageUrl);
                if (match) {
                  navigation.navigate('Order', { place: match });
                }
              }}
            >
              {!!card.imageUrl && (
                <Image source={{ uri: card.imageUrl }} style={styles.cardImage} />
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{card.name}</Text>
                <Text style={styles.cardMeta}>
                  {card.pricePerNight ? `${card.pricePerNight} / đêm` : ''}
                  {card.rating ? `  •  ${card.rating}★` : ''}
                </Text>
                {!!card.area && <Text style={styles.cardMeta}>{card.area}</Text>}
                {!!(card.amenities && card.amenities.length) && (
                  <Text numberOfLines={2} style={styles.cardAmenities}>{card.amenities.join(', ')}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return (
      <View style={[styles.bubble, item.isBot ? styles.bot : styles.user]}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={messagesRef}
        contentContainerStyle={styles.list}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nói chuyện với AI hoặc hỏi về khách sạn..."
          multiline
        />
        <TouchableOpacity style={[styles.send, loading && styles.sendDisabled]} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendText}>{loading ? '...' : 'Gửi'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  list: { padding: 12 },
  bubble: { padding: 12, borderRadius: 14, marginBottom: 10, maxWidth: '85%' },
  bot: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', alignSelf: 'flex-start' },
  user: { backgroundColor: '#007bff', alignSelf: 'flex-end' },
  text: { color: '#222', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  cardImage: { width: 260, height: 140, backgroundColor: '#ddd' },
  cardBody: { padding: 10, width: 260 },
  cardTitle: { fontWeight: '700', color: '#222', marginBottom: 4 },
  cardMeta: { color: '#666', marginBottom: 4 },
  cardAmenities: { color: '#007AFF' },
  inputRow: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fff', maxHeight: 120 },
  send: { marginLeft: 8, backgroundColor: '#007bff', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 10 },
  sendDisabled: { backgroundColor: '#9bbcf7' },
  sendText: { color: '#fff', fontWeight: '600' },
});

export default AIChatScreen;


