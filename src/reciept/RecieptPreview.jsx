import { View, Text } from 'react-native';

export default function ReceiptPreview({ text }) {
  console.log('ReceiptPreview text:', text);
  return (
    <View
      style={{
        backgroundColor: 'black',
        padding: 12,
        marginTop: 10,
        height: 200,
        overflow: 'scroll',
        width: '100%',
      }}
    >
      <Text
        style={{
          fontFamily: 'monospace',

          fontSize: 14,
          lineHeight: 18,
        }}
      >
        <Text style={{ color: '#914d4dff' }}>{text.shopName}</Text>
      </Text>
    </View>
  );
}
