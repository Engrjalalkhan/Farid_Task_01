import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const QRCodeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleShare = () => {
    // Add sharing functionality here
    console.log('Share QR Code');
  };

  const handleDelete = () => {
    // Add delete functionality here
    console.log('Delete QR Code');
  };

  const openQRCodeModal = () => {
    setModalVisible(true);
  };

  const closeQRCodeModal = () => {
    setModalVisible(false);
  };

  const navigateHome = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.qrCard}>
        <Icon name="qrcode" size={80} color="#000" />
        <Text style={styles.qrText}>Generated QR Code</Text>
        <View style={styles.qrActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.openButton} onPress={openQRCodeModal}>
          <Text style={styles.openButtonText}>View QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeQRCodeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.qrImage} />
            <TouchableOpacity style={styles.closeButton} onPress={closeQRCodeModal}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={navigateHome}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  qrActions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  openButton: {
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  qrImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;
