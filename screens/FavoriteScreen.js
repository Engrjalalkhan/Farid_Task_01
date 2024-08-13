/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Initialize banner ad ID (replace with your ad unit ID)
const bannerAdUnitId = __DEV__ ? TestIds.BANNER : '';

const FavoriteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { favoriteCodes, setFavoriteCodes } = route.params;
  const [visibleCodes, setVisibleCodes] = React.useState(favoriteCodes);
  const [selectedQRCode, setSelectedQRCode] = React.useState(null);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const handleViewQRCode = qrCode => {
    setSelectedQRCode(qrCode);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedQRCode(null);
  };

  const handleDeleteQRCode = item => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this QR code from the screen?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setVisibleCodes(prevCodes =>
              prevCodes.filter(code => code !== item),
            );
          },
        },
      ],
    );
  };

  const handleFavoriteQRCode = item => {
    // This function is to toggle the favorite status; it's not directly used here.
  };

  const renderFavoriteCard = ({ item }) => {
    const qrCodeData = JSON.parse(item);

    return (
      <View>
        <View style={styles.qrCodeCard}>
          <Text></Text>
          <View style={styles.qrCodeHeader}>
            <Text style={styles.usernameText}>{qrCodeData.username}</Text>
            <TouchableOpacity onPress={() => handleFavoriteQRCode(item)}>
              <Icon
                name={favoriteCodes.includes(item) ? 'star' : 'star-o'}
                size={24}
                color={favoriteCodes.includes(item) ? 'gold' : 'gray'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.qrCodeContent}>
            <View style={styles.detailsContainer}>
              <Text style={styles.networkCategoryText}>
                <Icon name="home" size={16} color="#000" /> {qrCodeData.networkCategory}
              </Text>
              <Text style={styles.encryptionTypeText}>
                <MaterialIcons name="security" size={16} color="#000" /> {qrCodeData.encryptionType}
              </Text>
            </View>
            <TouchableOpacity style={styles.qrCodeIconContainer}>
              <Icon name="qrcode" size={50} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.qrCodeActions}>
            <TouchableOpacity
              onPress={() => handleViewQRCode(item)}
              style={{ backgroundColor: '#2196F3', width: '50%', borderRadius: 10, height: 30 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                }}>
                Share
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteQRCode(item)}>
              <Icon name="trash" size={30} color="red" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bannerAdContainer}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Favorites</Text>
      </View>
      {visibleCodes.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
      ) : (
        <FlatList
          data={visibleCodes}
          renderItem={renderFavoriteCard}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.viewQRCodeModalContent}>
            {selectedQRCode && (
              <>
                <QRCode value={selectedQRCode} size={200} />
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  qrCodeCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    width: 330,
    alignSelf:'center'
  },
  qrCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  qrCodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  qrCodeIconContainer: {
    marginLeft: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  networkCategoryText: {
    fontSize: 14,
    color: '#777',
  },
  encryptionTypeText: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  qrCodeActions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewQRCodeModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerAdContainer: {
    marginVertical: 8, // Add spacing around the banner ad
    alignItems: 'center', // Center the ad horizontally
  },
});

export default FavoriteScreen;
