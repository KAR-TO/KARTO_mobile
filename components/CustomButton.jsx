import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Colors, Fonts } from '../constants/theme'

const CustomButton = ({
  title,
  onPress,
  color = '#FFFFFF',
  backgroundColor = Colors.primary,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.button,
        { backgroundColor: disabled ? Colors.disabled : backgroundColor },
      ]}
      onPress={!disabled && !loading ? onPress : null}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text style={[styles.buttonText, { color }]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 57,

  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: 18,
  },
})

export default CustomButton
