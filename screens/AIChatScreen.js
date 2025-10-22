import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import { aiChatScreenStyles } from '../styles/AIChatScreenStyles';


const ai = new GoogleGenAI({ apiKey: 'AIzaSyBEP6nNfWUQ4uhdtGzrL_6ivLc3E2WRt6Q' });

const AIChatScreen = ({ route, navigation }) => {
  const selectedCity = route?.params?.city || null;
  const { city } = route.params || { city: 'Hồ Chí Minh' }; // fallback nếu không có params
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotelsLookup, setHotelsLookup] = useState([]);

  const messagesRef = useRef(null);

  useEffect(() => {
    setMessages([{
      id: Date.now().toString(),
      text: '👋 Xin chào! Tôi là AI tư vấn du lịch của bạn. Hãy nói yêu cầu (ngân sách, vị trí, số người...) để tôi gợi ý khách sạn phù hợp.',
      isBot: true
    }]);
  }, []);

  const fetchContextData = async () => {
    const hotelsQ = selectedCity
      ? query(collection(firestore, 'hotels'), where('city', '==', selectedCity))
      : collection(firestore, 'hotels');
    const hotelSnap = await getDocs(hotelsQ);
    const hotels = hotelSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    setHotelsLookup(hotels);
    return { hotels, city: selectedCity };
  };

  const checkIfDatabaseQuestion = (text) => {
    const kws = [
      'giá','ngân sách','rẻ','dưới','trên','gần','trung tâm','biển',
      'tiện ích','hồ bơi','bữa sáng','đậu xe','wifi','gia đình',
      'cặp đôi','đánh giá','rating','xếp hạng','khuyến mãi','ưu đãi',
      'phòng trống','còn phòng','check in','check-out','hủy miễn phí',
      'so sánh','gợi ý','recommend','homestay','hotel','khách sạn'
    ];
    const t = text.toLowerCase();
    return kws.some(k => t.includes(k));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const isDB = checkIfDatabaseQuestion(userMsg.text);
      let systemPrompt = '';

      if (isDB) {
        const ctx = await fetchContextData();
        systemPrompt = `
Bạn là AI tư vấn du lịch cho KHÁCH HÀNG.
Thành phố: ${selectedCity || 'không xác định'}.

Dữ liệu khách sạn (có trường mainImage là ảnh):
${JSON.stringify(ctx, null, 2)}

Trả lời theo định dạng JSON (KHÔNG thêm chữ nào ngoài JSON):
{
  "type": "suggestions",
  "items": [
    {"name": string, "pricePerNight": string|number, "rating": number|null, "area": string|null, "amenities": string[], "imageUrl": string|null}
  ],
  "askMore": string|null
}

Yêu cầu: chọn 3–5 khách sạn phù hợp; imageUrl lấy từ mainImage; nếu thiếu thông tin → items=[] và điền askMore.
Câu hỏi khách: ${userMsg.text}
`;
      } else {
        systemPrompt = `
Bạn là trợ lý du lịch thân thiện. 
Hãy trả lời tự nhiên, ngắn gọn, tích cực.
Tin nhắn: ${userMsg.text}
`;
      }


      const result = await ai.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    }
  ],
});


let text = '(Không có phản hồi)';
if (result?.response && typeof result.response.text === 'function') {
  text = await result.response.text();
} else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
  text = result.candidates[0].content.parts[0].text;
}


      // 🧠 Parse JSON nếu có
      let added = false;
      try {
        const cleaned = text
          .replace(/^```json\s*/i, '')
          .replace(/```$/i, '')
          .trim();
        const json = JSON.parse(cleaned);
        if (json?.type === 'suggestions' && Array.isArray(json.items)) {
          const cards = json.items.map(it => ({
            name: it.name,
            pricePerNight: it.pricePerNight,
            rating: it.rating,
            area: it.area,
            amenities: it.amenities || [],
            imageUrl: it.imageUrl,
          }));
          setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), isBot: true, cards },
          ]);
          if (json.askMore) {
            setMessages(prev => [
              ...prev,
              { id: Date.now().toString(), isBot: true, text: json.askMore },
            ]);
          }
          added = true;
        }
      } catch (e) {
        console.log('Không parse được JSON:', e);
      }

      if (!added) {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), text, isBot: true },
        ]);
      }

    } catch (err) {
      console.error('Lỗi gọi Gemini:', err);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: '❌ Lỗi kết nối tới AI.', isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    if (item.cards) {
      return (
        <View style={[aiChatScreenStyles.bubble, aiChatScreenStyles.bot]}>
          <Text style={[aiChatScreenStyles.text, { marginBottom: 6 }]}>Gợi ý cho bạn:</Text>
          {item.cards.map(card => (
            <TouchableOpacity
              key={card.name}
              style={aiChatScreenStyles.card}
              onPress={() => {
                const match = hotelsLookup.find(h => h.hotelName === card.name);
                if (match) navigation.navigate('Order', { place: match });
              }}
            >
              {card.imageUrl && <Image source={{ uri: card.imageUrl }} style={aiChatScreenStyles.cardImage} />}
              <View style={aiChatScreenStyles.cardBody}>
                <Text style={aiChatScreenStyles.cardTitle}>{card.name}</Text>
                <Text style={aiChatScreenStyles.cardMeta}>
                  {card.pricePerNight ? `${card.pricePerNight} / đêm` : ''}
                  {card.rating ? ` • ${card.rating}★` : ''}
                </Text>
                {card.area && <Text style={aiChatScreenStyles.cardMeta}>{card.area}</Text>}
                {!!card.amenities?.length && (
                  <Text numberOfLines={2} style={aiChatScreenStyles.cardAmenities}>{card.amenities.join(', ')}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={[aiChatScreenStyles.bubble, item.isBot ? aiChatScreenStyles.bot : aiChatScreenStyles.user]}>
        <Text style={[aiChatScreenStyles.text, item.isBot ? {} : { color: '#fff' }]}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={aiChatScreenStyles.page}>
      {/* Custom Header */}
      <View style={aiChatScreenStyles.header}>
        <TouchableOpacity 
          style={aiChatScreenStyles.backButton} 
          onPress={() => navigation.navigate('CityDetailsScreen', { city })}
        >
          <Text style={aiChatScreenStyles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={aiChatScreenStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={messagesRef}
          contentContainerStyle={aiChatScreenStyles.list}
          data={messages}
          renderItem={renderItem}
          keyExtractor={it => it.id}
        />
        <View style={aiChatScreenStyles.inputRow}>
          <TextInput
            style={aiChatScreenStyles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nói chuyện với AI hoặc hỏi về khách sạn..."
            multiline
          />
          <TouchableOpacity
            style={[aiChatScreenStyles.send, loading && aiChatScreenStyles.sendDisabled]}
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={aiChatScreenStyles.sendText}>{loading ? '...' : 'Gửi'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AIChatScreen;
