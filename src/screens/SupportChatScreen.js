import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import colors from '../theme';

export default function SupportChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'agent' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'This is a mock AI/agent response.', sender: 'agent' }]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.msgBubble, item.sender === 'user' ? styles.userBubble : styles.agentBubble]}>
                <Text style={styles.msgText}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 16 }}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              accessible={true}
              accessibilityLabel="Chat input"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} accessible={true} accessibilityLabel="Send message">
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'flex-end' },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  agentBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface },
  msgText: { color: '#fff', fontSize: 15 },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: colors.surface, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  sendBtn: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  sendText: { color: '#fff', fontWeight: 'bold' },
}); 