// import { Button } from '../../ui/Button';
// import { Text } from '../../ui/Text';
// import * as WebBrowser from 'expo-web-browser';
// import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
// import { useState } from 'react';
// import { View } from 'react-native';
// import { useAuth } from '@clerk/clerk-expo';
// import Razorpay from 'react-native-razorpay';
// WebBrowser.maybeCompleteAuthSession();

// export const SocialLogin = () => {
//   const { googleLogin, isAuthLoading } = useAuthContext();
//   const { isSignedIn } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       googleLogin();
//     } catch (err) {
//       console.error('OAuth error', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button
//       variant="outline"
//       className="h-14 w-full flex-row items-center justify-center gap-x-3 rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-md"
//       onPress={handleGoogleLogin}
//       disabled={loading || isSignedIn || isAuthLoading}>
//       {/* Google Icon */}
//       <View className="h-6 w-6 items-center justify-center rounded-full bg-white">
//         <Text className="text-sm">G</Text>
//       </View>

//       <Text className="text-lg font-semibold text-white">
//         {loading || isAuthLoading
//           ? 'Signing  in...'
//           : isSignedIn
//             ? 'Signing In...'
//             : 'Continue with Google'}
//       </Text>
//     </Button>
//   );
// };

import React from 'react';
import { View, Button, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

export default function RazorpayTest() {
  const openRazorpay = () => {
    const options = {
      description: 'Test Razorpay Checkout',
      image: 'https://your-cdn.com/logo.png', // optional
      currency: 'INR',
      key: 'rzp_test_R6pYkD49StkDpj',
      order_id: 'order_Ii',
      amount: 1000, // in paise (₹50.00)
      name: 'MyApp',
      method: {
        netbanking: true,
        card: false,
        upi: true,
        wallet: false,
      },
      prefill: {
        email: 'testuser@example.com',
        contact: '9876543210',
        name: 'Test User',
      },
      theme: { color: '#3399cc' },
    };

    RazorpayCheckout.open(options)
      .then((data: any) => {
        // success callback
        Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
      })
      .catch((error: any) => {
        // failure callback
        Alert.alert('Error', `${error.code} | ${error.description}`);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pay with Razorpay" onPress={openRazorpay} />
    </View>
  );
}
